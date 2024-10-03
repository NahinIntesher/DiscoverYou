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
        <div className="flex justify-between">
          <div className="content">
            <div className="title">Welcome, {user.student_name}</div>
            <div className="description">
              Here you can view your progress in contests, showcases, courses,
              and webinars.
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between" style={{background: "#c9c9c9"}}>
        <Graphs />
        <Leaderboard />
      </div>
    </div>
  );
}
