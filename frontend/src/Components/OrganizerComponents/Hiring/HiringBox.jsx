import React from "react";

export default function HiringBox({
  hiringId,
  companyName,
  jobName,
  jobCategory,
  jobDescription,
  organizerName,
  organizerId,
  setUpdate,
  startTime,
  endTime,
  calculatedTime,
  participants,
  type,
}) {

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
              <MaterialSymbol
                className="icon"
                size={28}
                icon="calendar_month"
              />
              <div className="text">
                <div className="detailTitle">Date</div>
                <div className="detailInfo">{getDate(startTime)}</div>
              </div>
            </div>
            <div className="detail">
              <MaterialSymbol className="icon" size={28} icon="schedule" />
              <div className="text">
                <div className="detailTitle">Time</div>
                <div className="detailInfo">
                  {getPMTime(startTime)} - {getPMTime(endTime)}
                </div>
              </div>
            </div>
          </div>
          {(type == "ongoing" || type == "upcoming") && (
            <ContestTimeRemaining type={type} calculatedTime={calculatedTime} />
          )}
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
          <button onClick={handleSeeDetails} className="joinButton">
            See Details
          </button>
          {/* <div className="joinButtonContainer">
          {type == "ongoing" ? 
          isRegistered ? (
            <a href={meetingLink} className="joinButton">Join Meeting</a>
          ) :  (
            <div onClick={notRegisteredError} className="joinButton inactiveButton">Join Meeting</div>
          ) : type == "upcoming" ? 
          isRegistered ? (
            <div className="joinButton" onClick={registerWebinar}>Unregister</div>
          ) : (
            <div className="joinButton" onClick={registerWebinar}>Register</div>
          ) : (
            <a href={recordedLink} className="joinButton">Watch Record</a>
          )}
          <div className="joinDetails">
            Participant: <b>{participantNo}</b>
          </div> */}
        </div>
      </div>
    </div>
  );
}
