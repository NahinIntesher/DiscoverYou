import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import BrowseStudent from "./BrowseStudent";
import BrowseOrganizer from "./BrowseOrganizer";
import BrowseAdmin from "./BrowseAdmin";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState(["browseStudents"]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Manage users</div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "browseStudents" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseStudents");
          }}
        >
          Students
        </div>
        <div
          className={activeTab == "browseOrganizers" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseOrganizers");
          }}
        >
          Organizers
        </div>
        <div
          className={activeTab == "browseAdmins" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("browseAdmins");
          }}
        >
          Admins
        </div>
      </div>
      {activeTab == "browseStudents" && <BrowseStudent />}
      {activeTab == "browseOrganizers" && <BrowseOrganizer />}
      {activeTab == "browseAdmins" && <BrowseAdmin />}
    </div>
  );
}
