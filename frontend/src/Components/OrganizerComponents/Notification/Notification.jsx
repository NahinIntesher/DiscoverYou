import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";

export default function Notifications({ user }) {
  const [notifications, setnotifications] = useState([]);

  // useEffect(() => {
  //     axios
  //       .get("http://localhost:3000/organizer/hirings")
  //       .then((res) => {
  //         const hirings = res.data?.hirings || [];
  //         sethirings(hirings);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching hirings:", error);
  //       });
  // }, [updatePost]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Notifications</div>
        </div>
      </div>
    </div>
  );
}
