import React from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import dp from "../../assets/images/default.jpg";


export default function NotificationBox({
    notificationTitle, 
    notificationMessage, 
    notificationLink,
    notificationPicture
}) {
  return (
    <Link to={notificationLink} className="notificationBox">
        <img src={notificationPicture ? notificationPicture : dp}/>
        <div className="texts">
            <div className="title">{notificationTitle}</div>
            <div className="message">{notificationMessage}</div>
        </div>
    </Link>
  )
}