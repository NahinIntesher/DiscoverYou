import React from "react";
import "../../../assets/styles/contest.css";
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";

export default function ApprovedContest() {
  return (
    <div className="content">
      <h3 className="contentSemiTitle">Ongoing Contests</h3>
      <OngoingContest/>
      <div className="miniBreak"></div>

      <h3 className="contentSemiTitle">Upcoming Contests</h3>
      <UpcomingContest/>
      <div className="miniBreak"></div>

      <h3 className="contentSemiTitle">Previous Contests</h3>
      <PreviousContest/>
    </div>
  );
}
