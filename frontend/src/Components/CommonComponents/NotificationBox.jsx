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
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  return (
    <Link to={notificationLink} className="notificationBox">
      <img src={notificationPicture ? notificationPicture : dp} />
      <div className="texts">
        <div className="title">{notificationTitle}</div>
        <div className="message">{notificationMessage}</div>
      </div>
      <div  className="texts">
        <div className="dateTime">{getPMTime(notificationTime)}</div>
        <div className="dateTime">{getDate(notificationTime)}</div>
      </div>
    </Link>
  );
}
