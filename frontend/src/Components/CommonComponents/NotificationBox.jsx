import React from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../assets/images/default.jpg";

export default function NotificationBox({
  notificationTitle,
  notificationMessage,
  notificationLink,
  notificationPicture,
  notificationTime,
  notificationTimeAgo
}) {

  function calculatePostAgoTime(timeDifference) {
    if (timeDifference < 60) {
      return "Few sec ago";
    } else if ((timeDifference / 60) < 60) {
      return Math.floor(timeDifference / 60) + " min ago";
    } else if ((timeDifference / (60 * 60)) < 24) {
      return Math.floor(timeDifference / (60 * 60)) + " hour ago";
    } else {
      return Math.floor(timeDifference / (60 * 60 * 24)) + " day ago";
    }
  }
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
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  return (
    <Link to={notificationLink} className="notificationBox">
      <div className="profilePicture">
        <img src={notificationPicture ? notificationPicture : dp} />
      </div>
      <div className="texts">
        <div className="title">{notificationTitle}</div>
        <div className="message">{notificationMessage}</div>
        <div className="timeAgo">{calculatePostAgoTime(notificationTimeAgo)}</div>
      </div>
      <div className="dateTimeContainer">
        <div className="dateTime">{getPMTime(notificationTime)}</div>
        <div className="dateTime">{getDate(notificationTime)}</div>
      </div>
    </Link>
  );
}
