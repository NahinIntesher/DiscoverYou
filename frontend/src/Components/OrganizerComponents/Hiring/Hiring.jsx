import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
// import HiringBox from "./HiringBox";
import OngoingHirings from "./OngoingHirings";
import UpcomingHirings from "./UpcomingHirings";
import PreviousHirings from "./PreviousHirings";
import { MaterialSymbol } from "react-material-symbols";
// import MyWebinars from "./MyHirings";
import { Link } from "react-router-dom";

export default function Hiring({ user }) {
  const [pendingHiringsNo, setPendingHiringsNo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings/pending")
      .then((res) => {
        const pendingHiringsNo = res.data?.pendingHiringsNo || [];
        setPendingHiringsNo(pendingHiringsNo);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Hirings</div>
          <div className="buttonContainer">
            <Link to="/hiring/new" className="button">
              <MaterialSymbol className="icon" size={24} icon="add" />
              <div className="text">Create New Hiring</div>
            </Link>
          </div>
        </div>
      </div>
      {pendingHiringsNo != 0 &&
          <div className="pendingBox">
              <MaterialSymbol className="icon" size={32} icon="error" />
              <div className="text">
                  Your {pendingHiringsNo} hirings approval are in pending.
              </div>
              <Link to={"/webinar/pending"} className="button">
                  Pending Hirings
              </Link>
          </div>
      }
      <div className="content">
        <h3 className="contentSemiTitle">My Hirings</h3>
        {/* <MyWebinar/> */}
        <div className="miniBreak"></div>
  
        <h3 className="contentSemiTitle">Ongoing Hirings</h3>
        <OngoingHirings/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Hirings</h3>
        <UpcomingHirings/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Hirings</h3>
        <PreviousHirings/>
      </div>
    </div>
  );
}
