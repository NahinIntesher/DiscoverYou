import React, { Image } from "react";
import "../../assets/styles/sidebar.css";
import SidebarOption from "../SidebarOption";
import dp from "../../assets/images/default.jpg";
import logo from "../../assets/images/logo.svg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Sidebar({ logoutAction, user, notificationUpdate }) {
  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/notifications/new")
      .then((res) => {
        const notificationsData = res.data?.new_notifications || 0;
        setNewNotifications(notificationsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, [notificationUpdate]);
  return (
    <div className="sideMenu">
      <div className="content">
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="dynamicGap"></div>
        <div className="optionContainer">
          <SidebarOption name="Dashboard" href="/" icon="dashboard" />
          <SidebarOption
            name="Showcase"
            href="/showcase"
            icon="gallery_thumbnail"
          />
          <SidebarOption name="Contest" href="/contest" icon="rewarded_ads" />
          <SidebarOption name="Webinar" href="/webinar" icon="patient_list" />
          <SidebarOption
            name="Marketplace"
            href="/marketplace"
            icon="shopping_cart"
          />
          <SidebarOption name="Hiring" href="/hiring" icon="person_search" />

          {newNotifications ? (
            <SidebarOption
              name="Notification"
              href="/notification"
              icon="notifications_active"
              badge={newNotifications}
            />
          ) : (
            <SidebarOption
              name="Notification"
              href="/notification"
              icon="notifications_active"
            />
          )}
          <SidebarOption name="Profile" href="/profile" icon="person" />
        </div>
        <div className="dynamicGap"></div>
        <div className="profile">
          <div className="profilePicture">
            <img src={user.organizer_picture ? user.organizer_picture : dp} />
          </div>
          <div className="details">
            <div className="name">{user.organizer_name}</div>
            <div onClick={logoutAction} className="logout">
              <MaterialSymbol className="icon" size={20} icon="logout" />
              <div className="text">Logout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
