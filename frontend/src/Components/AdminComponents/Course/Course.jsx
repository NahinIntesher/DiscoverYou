import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import BrowseCourses from "./BrowseCourses";
import PendingCourses from "./PendingCourses";

export default function Course() {
  const [activeTab, setActiveTab] = useState(["browseCourses"]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Course</div>
          
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingCourses" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("pendingCourses");
          }}
        >
          Pending Courses
        </div>
        <div
          className={activeTab == "browseCourses" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseCourses");
          }}
        >
          Approved Courses
        </div>
      </div>
      {activeTab == "pendingCourses" && <PendingCourses />}
      {activeTab == "browseCourses" && <BrowseCourses />}
    </div>
  );
}
