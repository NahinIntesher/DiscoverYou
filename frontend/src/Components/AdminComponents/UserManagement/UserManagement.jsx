import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/usermanagement.css";
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
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("browseStudents");
          }}
        >
          Students
        </div>
        <div
          className={activeTab == "browseOrganizers" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("browseOrganizers");
          }}
        >
          Organizers
        </div>
        <div
          className={activeTab == "browseAdmins" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
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


function InterestIcon(data) {
  //   console.log();
  data = data.category;
  if (data == "Competitive Programming") {
    return <MaterialSymbol className="icon" size={22} icon="code" />;
  } else if (data == "Singing") {
    return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
  } else if (data == "Graphics Designing") {
    return <MaterialSymbol className="icon" size={22} icon="polyline" />;
  } else if (data == "Photography") {
    return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
  } else if (data == "Web/App Designing") {
    return <MaterialSymbol className="icon" size={22} icon="web" />;
  } else if (data == "Writing") {
    return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
  } else if (data == "Art & Craft") {
    return <MaterialSymbol className="icon" size={22} icon="draw" />;
  } else if (data == "Debating") {
    return <MaterialSymbol className="icon" size={22} icon="communication" />;
  } else if (data == "Gaming") {
    return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
  } else {
    return <MaterialSymbol className="icon" size={22} icon="interests" />;
  }
}
