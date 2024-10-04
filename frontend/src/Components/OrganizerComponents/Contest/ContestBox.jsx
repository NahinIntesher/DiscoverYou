import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/desert4.jpg";
import ContestTimeRemaining from "../../CommonComponents/contestTimeRemaining";
import { Link, useNavigate } from 'react-router-dom';
export default function ContestBox({
  id,
  name,
  category,
  organizerName,
  date,
  startTime,
  endTime,
  participants,
  calculatedTime,
  type,
  isOwn,
  organizerId,
  organizerPicture
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
  const navigate = useNavigate();

  const handleClick = () => {
    if(isOwn || type == "previous") {
      navigate(`/contest/${id}`);
    } else {
      alert("You can not see details of other organizer's ongoing and upcoming contest!")
    }
  };

  return (
    <div className="contestBox">
      <div className="informationContainer">
        <div className="information">
          <div className="title">{name}</div>
          <div className="category">
            {category === "Competitive Programming" && (
              <MaterialSymbol className="icon" size={24} icon="code" />
            )}
            {category === "Singing" && (
              <MaterialSymbol className="icon" size={24} icon="queue_music" />
            )}
            {category === "Graphics Designing" && (
              <MaterialSymbol className="icon" size={24} icon="polyline" />
            )}
            {category === "Photography" && (
              <MaterialSymbol className="icon" size={24} icon="photo_camera" />
            )}
            {category === "Web/App Designing" && (
              <MaterialSymbol className="icon" size={24} icon="web" />
            )}
            {category === "Writing" && (
              <MaterialSymbol className="icon" size={24} icon="edit_note" />
            )}
            {category === "Art & Craft" && (
              <MaterialSymbol className="icon" size={24} icon="draw" />
            )}
            {category === "Debating" && (
              <MaterialSymbol className="icon" size={24} icon="communication" />
            )}
            {category === "Gaming" && (
              <MaterialSymbol
                className="icon"
                size={24}
                icon="sports_esports"
              />
            )}
            <div className="text">{category}</div>
          </div>
        </div>
        <div className="joinButtonContainer">
          <div className={(isOwn || type == "previous") ? "joinButton" : "joinButton inactiveButton"} onClick={handleClick}>See Details</div> 
          <div className="joinDetails">
            Registered: <b>{participants}</b>
          </div>
        </div>
      </div>
      <div className="detailsContainer">
        <div className="detailsContent">
          <Link to={"/profile/"+organizerId} className="organizer">
            <div className="organizerPicture">
              <img src={organizerPicture ? organizerPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Organized By</div>
              <div className="detailInfo">{organizerName}</div>
            </div>
          </Link>
          <div className="details">
            <div className="detail">
              <MaterialSymbol
                className="icon"
                size={28}
                icon="calendar_month"
              />
              <div className="text">
                <div className="detailTitle">Date</div>
                <div className="detailInfo">{getDate(date)}</div>
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
    </div>
  );
}
