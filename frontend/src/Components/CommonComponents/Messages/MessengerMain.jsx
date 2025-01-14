// MessengerMain Component
import React, { useState } from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";

export default function MessengerMain({ user }) {
  const [formData, setFormData] = useState({ message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message Sent:", formData.message);
    setFormData({ message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((oldFormData) => ({
      ...oldFormData,
      [name]: value,
    }));
  };

  return (
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
  );
}
