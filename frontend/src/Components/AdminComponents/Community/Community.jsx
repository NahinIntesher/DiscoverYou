import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import BrowseCommunities from "./BrowseCommunities";
import PendingCommunities from "./PendingCommunities";

export default function Community() {
  const [activeTab, setActiveTab] = useState(["browseCommunities"]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Community</div>
          
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingCommunities" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("pendingCommunities");
          }}
        >
          Pending Communities
        </div>
        <div
          className={activeTab == "browseCommunities" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseCommunities");
          }}
        >
          Approved Communities
        </div>
      </div>
      {activeTab == "pendingCommunities" && <PendingCommunities />}
      {activeTab == "browseCommunities" && <BrowseCommunities />}
    </div>
  );
}
