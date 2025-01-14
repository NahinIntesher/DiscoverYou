
// MessengerHome Component
import React from "react";
import MessengerSidebar from "./MessengerSidebar";
import MessengerMain from "./MessengerMain";
import "./messages.css";

export default function MessengerHome({ user }) {
  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Messaging</div>
        </div>
      </div>
      <div className="messagesBoxContainer">
        <MessengerSidebar />
        <MessengerMain user={user} />
      </div>
    </div>
  );
}