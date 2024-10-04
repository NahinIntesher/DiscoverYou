import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import BrowseProducts from "./BrowseProducts";
import PendingProducts from "./PendingProducts";
import NotFound from "../../CommonComponents/NotFound";
import CartProductBox from "./CartProductBox";

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState(["browseProducts"]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Marketplace</div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingProducts" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("pendingProducts");
          }}
        >
          Pending Products
        </div>
        <div
          className={activeTab == "browseProducts" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("browseProducts");
          }}
        >
          Browse Products
        </div>
      </div>
      {activeTab == "browseProducts" && <BrowseProducts />}
      {activeTab == "pendingProducts" && <PendingProducts />}
    </div>
  );
}
