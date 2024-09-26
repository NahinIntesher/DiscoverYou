import React from "react";
import "../../../assets/styles/contest.css";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";

export default function ApprovedWebinar() {
  return (
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
  );
}
