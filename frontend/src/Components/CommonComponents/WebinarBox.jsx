import React, { useState } from "react";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../assets/images/desert4.jpg";
import ContestTimeRemaining from "./contestTimeRemaining";
import { useNavigate } from "react-router-dom";

export default function WebinarBox({
  id,
  name,
  description,
  category,
  recordedLink,
  meetingLink,
  host,
  date,
  startTime,
  endTime,
  participants,
  calculatedTime,
  type,
  isJoined,
}) {
  const [isRegistered, setIsRegistered] = useState(isJoined);
  const [participantNo, setParticipantNo] = useState(participants);
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

  function registerWebinar() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/webinars/register", {
        webinarId: id,
      })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "Registered") {
          setIsRegistered(true);
          setParticipantNo((prevValue) => prevValue + 1);
        } else if (res.data.status === "Unregistered") {
          setIsRegistered(false);
          setParticipantNo((prevValue) => prevValue - 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }
  function notRegisteredError() {
    alert("Sorry, you didn't registered for this webinar!");
  }

  function handleSeeDetails() {
    navigate(`/webinar/${id}`);
  }

  return (
    <div className="webinarBox">
      <div className="titleContainer">
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
            <MaterialSymbol className="icon" size={24} icon="sports_esports" />
          )}
          <div className="text">{category}</div>
        </div>
      </div>
      <div className="detailsContainer">
        <div className="detailsContent">
          <div className="description">{description}</div>
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
      <div className="bottomContainer">
        <div className="hostContainer">
          <div className="host">
            <div className="hostPicture">
              <img src={dp} />
            </div>
            <div className="hostDetails">
              <div className="detailTitle">Organized By</div>
              <div className="detailInfo">{host}</div>
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
