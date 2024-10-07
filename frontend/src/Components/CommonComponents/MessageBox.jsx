import React from "react";
import dp from "../../assets/images/default.jpg";

export default function MessageBox({
  message,
  ownMessage,
  messengerName,
  messengerPicture,
  updateMessages,
}) {
  if (ownMessage) {
    return (
      <div className="messageBox ownMessage">
        <div className="messageContent">
          <div className="name">{messengerName}</div>
          <div className="message">{message}</div>
        </div>
        <div className="profilePicture">
          <img src={messengerPicture ? messengerPicture : dp} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="messageBox">
        <div className="profilePicture">
          <img src={messengerPicture ? messengerPicture : dp} />
        </div>
        <div className="messageContent">
          <div className="name">{messengerName}</div>
          <div className="message">{message}</div>
        </div>
      </div>
    );
  }
}
