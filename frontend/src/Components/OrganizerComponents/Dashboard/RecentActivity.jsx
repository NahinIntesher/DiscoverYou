import axios from "axios";
import React, { useEffect, useState } from "react";
import NotFound from "../../CommonComponents/NotFound";
import RecentActivityBox from "./RecentActivityBox";

export default function RecentActivity() {
  const [recentActivity, setRecentActivity] = useState([]);
  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    axios
      .get("http://localhost:3000/organizer/dashboard/recent-activity")
      .then((response) => {
        setRecentActivity(response.data.recentActivity);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "5px 2px",
          textAlign: "left",
          overflow: "hidden",
        }}
      >
        {recentActivity.length > 0 ? (
          <RecentActivityBox recentActivity={recentActivity} />
        ) : (
          <NotFound message="No student Found" />
        )}
      </div>
    </div>
  );
}
