// MessengerMain Component
import React, { useState, useEffect, act  } from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import MessageBox from "../../CommonComponents/MessageBox";
import axios from "axios";

export default function MessengerMain({ user, activeContact}) {
  const [messageText, setMessageText] = useState(null);
  const [messages, setMessages] = useState([]);
  const [updateMessages, setUpdateMessages] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(messageText);
    console.log(activeContact.other_user_id);

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/messages/send", {
        message: messageText,
        otherUserId: activeContact.other_user_id
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
    console.log(activeContact);
    const fetchCommunityData = () => {
      axios
        .get("http://localhost:3000/messages/single/" + activeContact.other_user_id)
        .then((res) => {
          console.log("Success o m");
          const messagesData = res.data?.messages || [];

          setMessages(messagesData);
        })
        .catch((error) => {
          console.error("Error fetching community:", error);
        });
    };
    if(activeContact != null) {

      fetchCommunityData(); // Fetch immediately
    }

    const interval = setInterval(fetchCommunityData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [updateMessages, activeContact]);

  return (
    <div className="MessengerMain">
      <div className="messagesBoxContainerAlt">
        {messages.map((message) => (
          <MessageBox
            key={message.message_id}
            message={message.message_content}
            ownMessage={message.own_message}
            messengerName={message.own_message ? (user.hasOwnProperty("student_name") ? user.student_name : user.organizer_name) : activeContact.other_user_name}
            messengerPicture={message.own_message ? ( user.hasOwnProperty("student_picture") ? user.student_picture : user.other_user_picture) : activeContact.other_user_picture} // Default picture
            updateMessages={updateMessages} // Ensure re-render when new message is sent
          />
        ))}
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
    </div>
  );
}
