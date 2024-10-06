import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";
import MyContest from "./MyContest";


export default function Contest() {
  const [contestPendingNo, setContestPendingNo] = useState(0);
  const [resultPending, setResultPending] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/contests/pending-details")
      .then((res) => {
        console.log("Success");
        const contestPendingNoData = res.data?.contestPendingNo || [];
        const resultPendingData = res.data?.resultPending || [];

        setContestPendingNo(contestPendingNoData);
        setResultPending(resultPendingData);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Contest</div>
          <div className="buttonContainer">
            <Link to="/contest/new" className="button">
              <MaterialSymbol className="icon" size={24} icon="add" />
              <div className="text">Create New Contest</div>
            </Link>
          </div>
        </div>
      </div>

      {contestPendingNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            Your {contestPendingNo} new contests approval are in pending.
          </div>
          <Link to={"/contest/pending"} className="button">
            Pending Contests
          </Link>
        </div>
      )}

      {resultPending.length &&
        resultPending.map(function (contest) {
          return (
            <div className="pendingBox">
              <MaterialSymbol className="icon" size={32} icon="error" />
              <div className="text">
                Your "{contest.contest_name}" contest time is over.
              </div>
              <Link to={"/contest/"+contest.contest_id} className="button">
                Give Result
              </Link>
            </div>
          )
        })
      }

      <div className="content">
        <h3 className="contentSemiTitle">My Contests</h3>
        <MyContest />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Ongoing Contests</h3>
        <OngoingContest />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Contests</h3>
        <UpcomingContest />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Contests</h3>
        <PreviousContest />
      </div>
    </div>
  );
}
