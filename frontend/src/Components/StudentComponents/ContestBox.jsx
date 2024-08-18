import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function ContestBox({
  name,
  details,
  category,
  organizer,
  date,
  startTime,
  endTime,
  participants,
}) {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const end = new Date(endTime);
    const timeRemaining = end - now;
    if (timeRemaining <= 0) return "None";
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="contestBox">
      <div className="informationContainer">
        <div className="information">
          <div className="title">{name}</div>
          <div className="category">
            {category === "programming" && (
              <>
                <MaterialSymbol className="icon" size={24} icon="code" />
                <div className="text">Programming</div>
              </>
            )}
            {category === "music" && (
              <>
                <MaterialSymbol className="icon" size={24} icon="queue_music" />
                <div className="text">Music</div>
              </>
            )}
            {category === "graphics" && (
              <>
                <MaterialSymbol className="icon" size={24} icon="draw" />
                <div className="text">Graphics Designing</div>
              </>
            )}
          </div>
        </div>
        <div className="joinButtonContainer">
          <div className="joinButton">Enter</div>
        </div>
      </div>
      <div className="detailsContainer">
        <div className="details">
          <div className="detail">
            <MaterialSymbol className="icon" size={28} icon="person" />
            <div className="text">
              <div className="detailTitle">Organizer</div>
              <div className="detailInfo">{organizer}</div>
            </div>
          </div>
          <div className="detail">
            <MaterialSymbol className="icon" size={28} icon="calendar_month" />
            <div className="text">
              <div className="detailTitle">Date</div>
              <div className="detailInfo">{date}</div>
            </div>
          </div>
        </div>
        <div className="details">
          <div className="detail">
            <MaterialSymbol
              className="icon"
              size={28}
              icon="supervisor_account"
            />
            <div className="text">
              <div className="detailTitle">Registered</div>
              <div className="detailInfo">{participants}</div>
            </div>
          </div>
          <div className="detail">
            <MaterialSymbol className="icon" size={28} icon="schedule" />
            <div className="text">
              <div className="detailTitle">Time</div>
              <div className="detailInfo">
                {startTime} - {endTime}
              </div>
            </div>
          </div>
        </div>
        <div className="center">
          <div className="timeRemaining">
            <MaterialSymbol className="icon" size={24} icon="schedule" />
            <div className="text">Time Remaining: {calculateTimeRemaining()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
