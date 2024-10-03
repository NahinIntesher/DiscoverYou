import React from "react";
import Graphs from "./Graphs";
import Leaderboard from "./LeaderBoard";

export default function Dashborad({ user }) {
  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Student Dashboard</div>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            transition: "background-color 0.3s ease-in-out",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#1f2937",
                marginBottom: "8px",
                borderBottom: "1px solid #d1d1d1",
              }}
            >
              Welcome, {user.student_name}
            </div>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>
              Here you can view your progress in contests, showcases, courses,
              and webinars.
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between" style={{ background: "#dcdcdc" }}>
        <Graphs />
        <Leaderboard />
      </div>
    </div>
  );
}
