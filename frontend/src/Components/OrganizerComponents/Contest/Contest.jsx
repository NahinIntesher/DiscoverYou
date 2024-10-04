import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";
import MyContest from "./MyContest";


export default function Contest() {

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Contest</div>
          <div className="buttonContainer">
            <Link to="/community/new" className="button">
                <MaterialSymbol className="icon" size={24} icon="add" />
                <div className="text">Create New Contest</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="content">
        <h3 className="contentSemiTitle">My Contests</h3>
        <MyContest/>
        <div className="miniBreak"></div>
        
        <h3 className="contentSemiTitle">Ongoing Contests</h3>
        <OngoingContest/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Contests</h3>
        <UpcomingContest/>
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Contests</h3>
        <PreviousContest/>
      </div>
    </div>
  );
}
