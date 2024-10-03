import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import Header from "../../CommonComponents/Header";
import MessageBox from "../../CommonComponents/MessageBox";

export default function SingleCommunity({ interests }) {
  const { communityId } = useParams();
  const [community, setCommunity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [updateMessages, setUpdateMessages] = useState(0);

  const [formData, setFormData] = useState({
    communityId: communityId,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/community/message", formData)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Message Send Success!");
          setFormData(function (oldFormData) {
            return {
              ...oldFormData,
              message: "",
            };
          });
          setUpdateMessages((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log("useEffect Cholled");
    axios
      .get("http://localhost:3000/student/community/single/" + communityId)
      .then((res) => {
        console.log("Success");
        let communityData = res.data?.community || [];
        let messagesData = res.data?.messages || [];

        setCommunity(communityData);
        setMessages(messagesData);
      })
      .catch((error) => {
        console.error("Error fetching community:", error);
      });
  }, [updateMessages]);

  return (
    <div className="mainContent">
      <Header
        title={community.community_name}
        semiTitle={community.community_category + " Community"}
      />
      <div className="messagesBoxContainer">
        {messages.map(function (message) {
          return (
            <MessageBox
              message={message.message_content}
              ownMessage={message.own_message}
              messengerName={message.messenger_name}
              messengerPicture={message.messenger_picture}
            />
          );
        })}
      </div>
      <div className="giveMessageBox">
        <form onSubmit={handleSubmit}>
          <div className="profilePicture">
            <img src={dp} />
          </div>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
          />
          <button className="sendButton">
            <MaterialSymbol className="icon" size={40} icon="send" fill />
          </button>
        </form>
      </div>
    </div>
  );
}
