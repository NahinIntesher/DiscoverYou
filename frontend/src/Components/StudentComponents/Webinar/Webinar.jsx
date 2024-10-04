import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";

export default function Webinar() {

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinar</div>
        </div>
      </div>
      <div className="content">
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
