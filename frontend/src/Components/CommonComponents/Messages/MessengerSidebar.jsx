// MessengerSidebar Component
import React from "react";

export default function MessengerSidebar() {
  const users = [
    {
      messengerName: "John Doe",
      message: "Hello there!",
      profilePicture: "https://via.placeholder.com/150",
    },
    {
      messengerName: "Jane Doe",
      message: "Hi!",
      profilePicture: "https://via.placeholder.com/150",
    },
    // Additional user data can be added here
  ];

  return (
    <div className="MessengerSidebar">
      <div className="messagesList">
        {users.map((user, index) => (
          <div className="message" key={index}>
            <div className="profilePicture">
              <img src={user.profilePicture} alt="Profile" />
            </div>
            <div className="messageContent">
              <div className="name">{user.messengerName}</div>
              <div className="messageText">{user.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
