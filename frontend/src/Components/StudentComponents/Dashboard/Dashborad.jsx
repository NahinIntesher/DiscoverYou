import React from "react";
import Graphs from "./Graphs";
import Leaderboard from "./LeaderBoard";
import "../../../App.css";
import "../../../assets/styles/dashboard.css";
import Overview from "./Overview";

export default function Dashborad({ user }) {
  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Student Dashboard</div>
        </div>
      </div>
      <Overview />
      <div className="flex">
        <div className="flex justify-center w-full">
          <Graphs />
        </div>
        <Leaderboard />
      </div>
    </div>
  );
}
