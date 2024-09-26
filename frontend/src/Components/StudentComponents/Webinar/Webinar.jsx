import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";

export default function Webinar() {
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/student/webinars")
  //     .then((response) => {
  //       const webinars = response.data.webinars;
  //       const now = new Date();

  //       const previous = webinars.filter(
  //         (webinar) => new Date(webinar.end_time) < now
  //       );
  //       const ongoing = webinars.filter(
  //         (webinar) =>
  //           new Date(webinar.start_time) <= now &&
  //           new Date(webinar.end_time) >= now
  //       );
  //       const upcoming = webinars.filter(
  //         (webinar) => new Date(webinar.start_time) > now
  //       );

  //       setPreviousWebinars(previous);
  //       setOngoingWebinars(ongoing);
  //       setUpcomingWebinars(upcoming);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching webinars:", error);
  //     });
  // }, []);

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
