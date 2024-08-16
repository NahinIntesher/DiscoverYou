import React from "react";
import "../assets/styles/contest.css";
import ContestBox from "./ContestBox";

export default function Contest() {
    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Contest</div>
                </div>
            </div>
            <div className="content">
                <div className="contentSemiTitle">Ongoing Contests</div>
                <ContestBox name="Programming for Begginer" category="programming" organizer="Nurul Alam Ador" date="16 August, 2024" startTime="10:00 PM" endTime="11:00 PM"/>
                <ContestBox name="Rabindra Jayantee Special" category="music" organizer="Nahin Intesher" date="16 August, 2024" startTime="10:00 PM" endTime="11:00 PM"/>
                <div className="miniBreak"></div>
                <div className="contentSemiTitle">Upcomming Contests</div>
                <ContestBox name="Programming for Professional" category="programming" organizer="Nahin Intesher" date="16 August, 2024" startTime="10:00 PM" endTime="11:00 PM"/>
                <ContestBox name="Bangladesh Police Logo Design" category="graphics" organizer="Nurul Alam Ador" date="16 August, 2024" startTime="10:00 PM" endTime="11:00 PM"/>
            </div>
        </div>
    );
}