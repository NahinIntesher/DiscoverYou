import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";
import MyWebinar from "./MyWebinar";

export default function Webinar() {
  const [pendingWebinarsNo, setPendingWebinarsNo] = useState(0);

  useEffect(() => {
    axios
        .get("http://localhost:3000/organizer/webinars/pending-details")
        .then((res) => {
            console.log("Success");
            const pendingWebinarNo = res.data?.pendingWebinarNo || [];

            setPendingWebinarsNo(pendingWebinarNo);
        })
        .catch((error) => {
            console.error("Error fetching contests:", error);
        });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinar</div>
          <div className="buttonContainer">
            <Link to="/webinar/new" className="button">
                <MaterialSymbol className="icon" size={24} icon="add" />
                <div className="text">Create New Webinar</div>
            </Link>
          </div>
        </div>
      </div>
      {pendingWebinarsNo != 0 &&
          <div className="pendingBox">
              <MaterialSymbol className="icon" size={32} icon="error" />
              <div className="text">
                  Your {pendingWebinarsNo} webinars approval are in pending.
              </div>
              <Link to={"/webinar/pending"} className="button">
                  Pending Webinars
              </Link>
          </div>
      }
      <div className="content">
        <h3 className="contentSemiTitle">My Webinars</h3>
        <MyWebinar/>
        <div className="miniBreak"></div>
  
        <h3 className="contentSemiTitle">Ongoing Webinars</h3>
        <OngoingWebinar/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Webinars</h3>
        <UpcomingWebinar/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Webinars</h3>
        <PreviousWebinar/>
      </div>
    </div>
  );
}
