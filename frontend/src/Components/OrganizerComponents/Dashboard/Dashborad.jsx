import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";

export default function Hirings({ user }) {
  const [hirings, sethirings] = useState([]);

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
          <div className="title">Dashborad</div>
        </div>
      </div>
    </div>
  );
}
