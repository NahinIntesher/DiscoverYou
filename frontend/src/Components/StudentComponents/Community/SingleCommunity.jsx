import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import Header from "../../CommonComponents/Header";
import MessageBox from "../../CommonComponents/MessageBox";

export default function SingleCommunity({ user, interests }) {
  const { communityId } = useParams();
  const [community, setCommunity] = useState({});
  const [messages, setMessages] = useState([]);
  const [updateMessages, setUpdateMessages] = useState(0);

  const [formData, setFormData] = useState({
    communityId: communityId,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((oldFormData) => ({
      ...oldFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/community/message", formData)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Message Sent Successfully!");
          setFormData((oldFormData) => ({
            ...oldFormData,
            message: "",
          }));
          setUpdateMessages((prevData) => prevData + 1); // Force a re-render
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchCommunityData = () => {
      axios
        .get("http://localhost:3000/student/community/single/" + communityId)
        .then((res) => {
          console.log("Success");
          const communityData = res.data?.community || {};
          const messagesData = res.data?.messages || [];

          setCommunity(communityData);
          setMessages(messagesData);
        })
        .catch((error) => {
          console.error("Error fetching community:", error);
        });
    };

    fetchCommunityData(); // Fetch immediately
    const interval = setInterval(fetchCommunityData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [communityId, updateMessages]);

  return (
    <div className="mainContent">
      <Header
        title={community.community_name}
        semiTitle={community.community_category + " Community"}
      />
      <div className="messagesBoxContainer">
        {messages.map((message) => (
          <MessageBox
            key={message.message_id}
            message={message.message_content}
            ownMessage={message.own_message}
            messengerName={message.messenger_name}
            messengerPicture={message.messenger_picture} // Default picture
            updateMessages={updateMessages} // Ensure re-render when new message is sent
          />
        ))}
      </div>
      <div className="giveMessageBox">
        <form onSubmit={handleSubmit}>
          <div className="profilePicture">
            <img src={user.student_picture ? user.student_picture : dp} alt="Default Profile" />
          </div>
          <input
            type="text"
            name="message"
            value={formData.message}
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
