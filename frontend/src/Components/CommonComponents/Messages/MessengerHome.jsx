
// MessengerHome Component
import React, { useState } from "react";
import MessengerSidebar from "./MessengerSidebar";
import MessengerMain from "./MessengerMain";
import "./messages.css";

export default function MessengerHome({ user }) {
  const [activeContact, setActiveContact] = useState(null);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Messaging</div>
        </div>
      </div>
      <div className="MessagesHomeContainer">
        <MessengerSidebar user={user} setActiveContact={setActiveContact}/>
        <MessengerMain user={user} activeContact={activeContact}/>
      </div>
    </div>
  );
}