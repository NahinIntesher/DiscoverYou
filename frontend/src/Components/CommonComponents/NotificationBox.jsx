import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../assets/images/default.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NotificationBox({
  notificationId,
  notificationTitle,
  notificationMessage,
  notificationLink,
  notificationPicture,
  notificationTime,
  notificationRead,
  notificationTimeAgo,
  setUpdate,
}) {
  const navigate = useNavigate();

  const [isRead, setIsRead] = useState(notificationRead);
  console.log(isRead);
  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function calculatePostAgoTime(timeDifference) {
    if (timeDifference < 60) {
      return "Few sec ago";
    } else if (timeDifference / 60 < 60) {
      return Math.floor(timeDifference / 60) + " min ago";
    } else if (timeDifference / (60 * 60) < 24) {
      return Math.floor(timeDifference / (60 * 60)) + " hour ago";
    } else {
      return Math.floor(timeDifference / (60 * 60 * 24)) + " day ago";
    }
  }
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  function handleClick() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/notifications/read", {
        notificationId: notificationId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Notification Read!");
          setUpdate((prevValue) => prevValue + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
    navigate(notificationLink);
  }

  return (
    <div
      onClick={handleClick}
      className="notificationBox"
      style={{ cursor: "pointer" }}
    >
      <div className="profilePicture">
        <img src={notificationPicture ? notificationPicture : dp} />
      </div>
      <div className="texts">
        {isRead ? <div>Readed</div> : <div>Not Readed</div>}
        <div className="title">{notificationTitle}</div>
        <div className="message">{notificationMessage}</div>
        <div className="timeAgo">
          {calculatePostAgoTime(notificationTimeAgo)}
        </div>
      </div>
      <div className="dateTimeContainer">
        <div className="dateTime">{getPMTime(notificationTime)}</div>
        <div className="dateTime">{getDate(notificationTime)}</div>
      </div>
    </div>
  );
}
