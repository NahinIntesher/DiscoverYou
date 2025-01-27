import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import ContestTimeRemaining from "../../CommonComponents/ContestTimeRemaining";
import { Link, useNavigate } from "react-router-dom";

export default function HiringBox({
  hiringId,
  organizerId,
  organizerName,
  organizerPicture,
  companyName,
  jobName,
  jobCategory,
  jobDescription,
  jobSalery,
  endTime,
  applicantsCount,
  calculatedTime,
}) {
  const navigate = useNavigate();
  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "medium" });
  }

  function seeDetails() {
    console.log("See Details");
    navigate("/hiring/" + hiringId);
  }

  return (
    <div className="hiringBox">
      <div className="titleContainer">
        <div className="information">
          <div className="title">{jobName}</div>
          <div className="semiTitle">{companyName}</div>
          <div className="category">
            {jobCategory === "Competitive Programming" && (
              <MaterialSymbol className="icon" size={24} icon="code" />
            )}
            {jobCategory === "Singing" && (
              <MaterialSymbol className="icon" size={24} icon="queue_music" />
            )}
            {jobCategory === "Graphics Designing" && (
              <MaterialSymbol className="icon" size={24} icon="polyline" />
            )}
            {jobCategory === "Photography" && (
              <MaterialSymbol className="icon" size={24} icon="photo_camera" />
            )}
            {jobCategory === "Web/App Designing" && (
              <MaterialSymbol className="icon" size={24} icon="web" />
            )}
            {jobCategory === "Writing" && (
              <MaterialSymbol className="icon" size={24} icon="edit_note" />
            )}
            {jobCategory === "Art & Craft" && (
              <MaterialSymbol className="icon" size={24} icon="draw" />
            )}
            {jobCategory === "Debating" && (
              <MaterialSymbol className="icon" size={24} icon="communication" />
            )}
            {jobCategory === "Gaming" && (
              <MaterialSymbol className="icon" size={24} icon="sports_esports" />
            )}
            <div className="text">{jobCategory}</div>
          </div>
        </div>
        <div className="salaryContainer">
            <div className="name">Salary</div>
            <div className="count">{jobSalery}৳</div>
        </div>
      </div>
      <div className="detailsContainer">
        <div className="description">
            <div className="name">Job Details</div>
            {jobDescription}
          </div>
          <div className="details">
            <div className="detail">
              <div className="detailTitle">Last Date For Apply</div>
                <div className="detailInfo">
                  {getDate(endTime)} ({getPMTime(endTime)})
                </div>
            </div>
            <ContestTimeRemaining
              type={"ongoing"}
              calculatedTime={calculatedTime}
            />
          </div>
      </div>
      <div className="bottomContainer">
        <div className="hostContainer">
          <Link to={"/profile/"+organizerId} className="host">
            <div className="hostPicture">
              <img src={organizerPicture ? organizerPicture : dp} />
            </div>
            <div className="hostDetails">
              <div className="detailTitle">Organized By</div>
              <div className="detailInfo">{organizerName}</div>
            </div>
          </Link>
        </div>
        <div className="joinButtonContainer">
          <button className="joinButton" onClick={seeDetails}>
            See Details
          </button>
        </div>
      </div>
    </div>
  );
}
