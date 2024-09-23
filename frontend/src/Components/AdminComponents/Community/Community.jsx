import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import BrowseCommunities from "./BrowseCommunities";

export default function Community() {
  const [activeTab, setActiveTab] = useState(["browseCommunities"]);
  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Commuanity</div>
          
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "browseCommunities" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseCommunities");
          }}
        >
          Browse Communities
        </div>
      </div>
      {activeTab == "myCommunities" && <MyCommunities />}
      {activeTab == "browseCommunities" && <BrowseCommunities />}
    </div>
  );
}
