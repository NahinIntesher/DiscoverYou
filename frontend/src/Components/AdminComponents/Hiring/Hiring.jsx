import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import BrowseHirings from "./BrowseHirings";
import PendingHirings from "./PendingHirings";

export default function Hiring() {
  const [activeTab, setActiveTab] = useState(["pendingHirings"]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Hirings</div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingHirings" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("pendingHirings");
          }}
        >
          Pending Hirings
        </div>
        <div
          className={activeTab == "browseHirings" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("browseHirings");
          }}
        >
          Approved Hirings
        </div>
      </div>
      {activeTab == "pendingHirings" && <PendingHirings />}
      {activeTab == "browseHirings" && <BrowseHirings />}
    </div>
  );
}
