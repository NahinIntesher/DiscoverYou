// MessengerMain Component
import React, { useState, useEffect, act } from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import MessageBox from "../../CommonComponents/MessageBox";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MessengerMain({ user, activeContactId }) {
  const [messageText, setMessageText] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [updateMessages, setUpdateMessages] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(messageText);

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
          setUpdateMessages((prevData) => prevData + 1); // Force a re-render
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
    console.log(activeContactId);
    const fetchCommunityData = () => {
      axios
        .get("http://localhost:3000/messages/single/" + activeContactId)
        .then((res) => {
          console.log("Success o m");
          const messagesData = res.data?.messages || [];

          setMessages(messagesData);
        })
        .catch((error) => {
          console.error("Error fetching community:", error);
        });
    };
    if (activeContactId != null) {

      fetchCommunityData(); // Fetch immediately
    }

    const interval = setInterval(fetchCommunityData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [updateMessages, activeContactId]);

  useEffect(() => {
    if (activeContactId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${activeContactId}`)
        .then((res) => {
          setOtherUser(res.data.user);
          setLoaded(true);
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
            <div className="messagesBoxContainerAlt">
              <div className="miniBr"></div>
              {messages.map((message) => (
                <MessageBox
                  key={message.message_id}
                  message={message.message_content}
                  ownMessage={message.own_message}
                  messengerName={message.own_message ? (user.hasOwnProperty("student_name") ? user.student_name : user.organizer_name) : otherUser.name}
                  messengerPicture={message.own_message ? (user.hasOwnProperty("student_picture") ? user.student_picture : user.other_user_picture) : otherUser.user_picture} // Default picture
                  updateMessages={updateMessages} // Ensure re-render when new message is sent
                />
              ))}

              <div className="contactIntroBox">
                <div className="profilePicture">
                  <img
                    src={otherUser.user_picture || dp}
                    alt="Profile"
                  />
                </div>
                <div className="contactName">{otherUser.name}</div>
                <Link to={"/profile/"+otherUser.id} className="visitProfile">Visit Profile</Link>
              </div>
              <div className="miniBr"/>
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
          <></>
        )
      }
    </div>
  );
}
