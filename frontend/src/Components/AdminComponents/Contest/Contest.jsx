import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";
import ApprovedContest from "./ApprovedContest";
import PendingContest from "./PendingContest";

export default function Contest() {
  const [activeTab, setActiveTab] = useState("approvedContests");

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/student/contest")
  //     .then((res) => {
  //       const contests = res.data.contests;
  //       const now = new Date();

  //       const previous = contests.filter(
  //         (contest) => new Date(contest.end_time) < now
  //       );
  //       const ongoing = contests.filter(
  //         (contest) =>
  //           new Date(contest.start_time) <= now &&
  //           new Date(contest.end_time) >= now
  //       );
  //       const upcoming = contests.filter(
  //         (contest) => new Date(contest.start_time) > now
  //       );

  //       setPreviousContests(previous);
  //       setOngoingContests(ongoing);
  //       setUpcomingContests(upcoming);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching contests:", error);
  //     });
  // }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Contest</div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingContests" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("pendingContests");
          }}
        >
          Pending Contests
        </div>
        <div
          className={activeTab == "approvedContests" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("approvedContests");
          }}
        >
          Approved Contests
        </div>
      </div>
      {activeTab == "pendingContests" && <PendingContest />}
      {activeTab == "approvedContests" && <ApprovedContest />}
    </div>
  );
}
