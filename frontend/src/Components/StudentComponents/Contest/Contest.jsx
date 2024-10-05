import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import ContestBox from "./ContestBox";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";

export default function Contest() {
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
    </div>
  );
}
