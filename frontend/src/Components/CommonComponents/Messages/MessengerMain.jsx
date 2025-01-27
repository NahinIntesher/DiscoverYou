// MessengerMain Component
import React, { useState, useEffect, act } from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import MessageBox from "../../CommonComponents/MessageBox";
import axios from "axios";
import { Link } from "react-router-dom";
import NotFoundAlt from "../NotFoundAlt";

export default function MessengerMain({ user, activeContactId, setMessageUpdate }) {
  const [messageText, setMessageText] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [updateMessages, setUpdateMessages] = useState(0);

  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function getDate(datetime) {
    let d1 = new Date();
    let d2 = new Date(datetime);
    if(!(d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate())) {
      return d2.toLocaleString("en-US", { dateStyle: "long" })+", ";
    }
    else {
      return "";
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/messages/send", {
        message: messageText,
        otherUserId: activeContactId
      })
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Message Sent Successfully!");
          setMessageText("");
          setUpdateMessages((prevData) => prevData + 1);

          const socket = new WebSocket("ws://localhost:8420"); // Replace with your WebSocket server URL

          socket.onopen = () => {
            socket.send("message");
            socket.close();
          };

          // Log if there is an error
          socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
          };

        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    e.preventDefault();
    setMessageText(e.target.value);
  };

  useEffect(() => {
    const fetchCommunityData = () => {
      if (activeContactId != null && !activeContactId.startsWith("Ad")) {
        axios
          .get("http://localhost:3000/messages/single/" + activeContactId)
          .then((res) => {
            const messagesData = res.data?.messages || [];

            setMessageUpdate((prevData) => prevData + 1);
            setMessages(messagesData);
          })
          .catch((error) => {
            console.error("Error fetching community:", error);
          });
      }
    };

    fetchCommunityData(); // Fetch immediately

    const interval = setInterval(fetchCommunityData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [updateMessages, activeContactId]);

  useEffect(() => {
    if (activeContactId != null && !activeContactId.startsWith("Ad")) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${activeContactId}`)
        .then((res) => {
          setOtherUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activeContactId]);

  return (
    <div className="MessengerMain">
      {
        (activeContactId != "all" && activeContactId != null && otherUser != null) ? (
          <>
            <div className="header">
              <div className="profilePicture">
                <img
                  src={otherUser.user_picture || dp}
                  alt="Profile"
                />
              </div>
              <div className="text">
                <div className="title">{otherUser.name}</div>
                <div className="semiTitle">{otherUser.type == "student" ? "Student" : "Organizer"}</div>
              </div>

            </div>
            <div className="messagesBoxContainerAlt">
              <div className="miniBr"></div>
              {messages.map((message, index) => {
                const currentMessageTime = new Date(message.message_time);

                const previousMessageTime = index < messages.length-1 ? new Date(messages[index + 1].message_time) : null;
              
                const timeDifference = previousMessageTime
                  ? (currentMessageTime - previousMessageTime) / (1000 * 60) // in minutes
                  : 0;

                return (
                  <>
                    <MessageBox
                      message={message.message_content}
                      ownMessage={message.own_message}
                      messengerPicture={
                        message.own_message
                          ? user.hasOwnProperty("student_picture")
                            ? user.student_picture
                            : user.other_user_picture
                          : otherUser.user_picture
                      }
                      updateMessages={updateMessages}
                    />
                    {(index === messages.length-1 || timeDifference > 30) && (
                      <div className="messageTime">
                        {getDate(message.message_time)+getPMTime(message.message_time)}
                      </div>
                    )}
                  </>
                );
              })}


              <div className="contactIntroBox">
                <div className="profilePicture">
                  <img
                    src={otherUser.user_picture || dp}
                    alt="Profile"
                  />
                </div>
                <div className="contactName">{otherUser.name}</div>
                <Link to={"/profile/" + otherUser.id} className="visitProfile">Visit Profile</Link>
              </div>
              <div className="miniBr" />
            </div>
            <div className="giveMessageBox">
              <form onSubmit={handleSubmit}>
                <div className="profilePicture">
                  <img
                    src={user?.student_picture || dp}
                    alt="Profile"
                  />
                </div>
                <input
                  type="text"
                  name="message"
                  value={messageText}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                />
                <button className="sendButton" type="submit">
                  <MaterialSymbol className="icon" size={40} icon="send" fill />
                </button>
              </form>
            </div>
          </>
        ) : (
          <NotFoundAlt
            icon="forum"
            message="No Chat Selected"
          />
        )
      }
    </div>
  );
}
