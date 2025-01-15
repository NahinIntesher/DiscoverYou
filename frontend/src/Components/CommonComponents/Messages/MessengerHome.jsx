
// MessengerHome Component
import React, { useState } from "react";
import MessengerSidebar from "./MessengerSidebar";
import MessengerMain from "./MessengerMain";
import "./messages.css";

export default function MessengerHome({ user }) {
  const [activeContact, setActiveContact] = useState({
    other_user_id: null,
  });

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Messaging</div>
        </div>
      </div>
      <div className="MessagesHomeContainer">
        <MessengerSidebar user={user} setActiveContact={setActiveContact} activeContact={activeContact}/>
        <MessengerMain user={user} activeContact={activeContact}/>
      </div>
    </div>
  );
}