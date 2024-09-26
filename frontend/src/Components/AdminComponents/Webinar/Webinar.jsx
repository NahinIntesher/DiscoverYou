import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import WebinarBox from "../../CommonComponents/WebinarBox";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import ApprovedWebinar from "./ApprovedWebinar";
import PendingWebinar from "./PendingWebinar";

export default function Webinar() {
  const [activeTab, setActiveTab] = useState("approvedWebinars");
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
      <div className="tabContainer">
        <div
          className={activeTab == "pendingWebinars" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("pendingWebinars");
          }}
        >
          Pending Webinars
        </div>
        <div
          className={activeTab == "approvedWebinars" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("approvedWebinars");
          }}
        >
          Approved Webinars
        </div>
      </div>
      {activeTab == "pendingWebinars" && <PendingWebinar/>}
      {activeTab == "approvedWebinars" && <ApprovedWebinar/>}
    </div>
  );
}
