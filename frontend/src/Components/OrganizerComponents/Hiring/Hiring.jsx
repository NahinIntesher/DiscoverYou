import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import HiringBox from "./HiringBox";
import { MaterialSymbol } from "react-material-symbols";
// import MyWebinars from "./MyHirings";
import { Link } from "react-router-dom";
import AllHiring from "./AllHirings";
import MyHirings from "./MyHirings";

export default function Hiring({ user }) {
  const [hirings, setHirings] = useState([]);
  const [pendingHiringsNo, setPendingHiringsNo] = useState([]);

  
  const [activeTab, setActiveTab] = useState(["allHirings"]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings/pending")
      .then((res) => {
        const pendingHiringsNo = res.data?.hirings || [];
        setPendingHiringsNo(pendingHiringsNo.length);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings")
      .then((response) => {
        const hiringsData = response.data.hirings;
        setHirings(hiringsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Hirings</div>
          <div className="buttonContainer">
            <Link to="/hiring/new" className="button">
              <MaterialSymbol className="icon" size={24} icon="add" />
              <div className="text">Create New Hiring</div>
            </Link>
          </div>
        </div>
      </div>
      {pendingHiringsNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            Your {pendingHiringsNo} hirings approval are in pending.
          </div>
          <Link to={"/hiring/pending"} className="button">
            Pending Hirings
          </Link>
        </div>
      )}

      <div className="tabContainer">
        <div className={activeTab == "myHirings" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myHirings")}}>My Posted Hirings</div>
        <div className={activeTab == "allHirings" ? "activeTab" : "tab"} onClick={function(){setActiveTab("allHirings")}}>All Hirings</div>
      </div>
      {
          activeTab == "allHirings" &&
          <AllHiring />
      }
      {
          activeTab == "myHirings" &&
          <MyHirings />
      }
    </div>
  );
}
