import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import NotFound from "../../CommonComponents/NotFound";
import NotificationBox from "../../CommonComponents/NotificationBox";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/notifications")
      .then((res) => {
        const notificationsData = res.data?.notifications || [];
        setNotifications(notificationsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Notifications</div>
        </div>
      </div>
      <div className="content center">
        {notifications.length ? (
          <div className="participantList">
            {notifications.map(function (notification) {
              return (
                <NotificationBox
                  key={notification.notification_id}
                  notificationId={notification.notification_id}
                  notificationTitle={notification.notification_title}
                  notificationMessage={notification.notification_message}
                  notificationLink={notification.notification_link}
                  notificationPicture={notification.notification_picture}
                  notificationTime={notification.sent_time}
                  notificationTimeAgo={notification.notification_time_ago}
                  notificationRead={notification.is_seen}
                />
              );
            })}
          </div>
        ) : (
          <NotFound message="No Notification Found!" />
        )}
      </div>
    </div>
  );
}
