
// MessengerHome Component
import React, { useEffect, useState } from "react";
import MessengerSidebar from "./MessengerSidebar";
import MessengerMain from "./MessengerMain";
import "./messages.css";
import { useParams } from "react-router-dom";

export default function MessengerHome({ user }) {
  const { otherUserId } = useParams();
  const [activeContactId, setActiveContactId] = useState(null);

  useEffect(() => {
    setActiveContactId(otherUserId);
  }, [otherUserId]);

  return (
    <div className="mainContent">
      <div className="MessagesHomeContainer">
        <MessengerSidebar user={user} setActiveContactId={setActiveContactId} activeContactId={activeContactId}/>
        <MessengerMain user={user} activeContactId={activeContactId}/>
      </div>
    </div>
  );
}