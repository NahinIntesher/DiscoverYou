import React from "react";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import ContestTimeRemaining from "../../CommonComponents/ContestTimeRemaining";
import { useNavigate } from "react-router-dom";

export default function HiringBox({
  hiringId,
  organizerId,
  organizerName,
  companyName,
  jobName,
  jobCategory,
  jobDescription,
  jobSalery,
  startTime,
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
    <div className="webinarBox">
      <div className="titleContainer">
        <div className="title">{jobName}</div>
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
      <div className="detailsContainer">
        <div className="detailsContent">
          <div className="description">{jobDescription}</div>
          <hr />
          <div className="details">
            <div className="detail">
              <div className="text">
                <div className="detailTitle">Job Salery</div>

                <div className="detailInfo">
                  <MaterialSymbol
                    className="icon"
                    size={20}
                    icon="attach_money"
                  />
                  {jobSalery}
                </div>
              </div>
            </div>
            <div className="detail">
              <MaterialSymbol
                className="icon"
                size={28}
                icon="calendar_month"
              />
              <div className="text">
                <div className="detailTitle">Last date for apply</div>
                <div className="detailInfo">
                  {getDate(endTime)} ({getPMTime(endTime)})
                </div>
              </div>
            </div>
          </div>
          {
            <ContestTimeRemaining
              type={"ongoing"}
              calculatedTime={calculatedTime}
            />
          }
        </div>
      </div>
      <div className="bottomContainer">
        <div className="hostContainer">
          <div className="host">
            <div className="hostPicture">
              <img src={dp} />
            </div>
            <div className="hostDetails">
              <div className="detailTitle">Organized By</div>
              <div className="detailInfo">{organizerName}</div>
            </div>
          </div>
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