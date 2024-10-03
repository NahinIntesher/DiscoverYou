import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import "../../../assets/styles/Profile.css";

export default function Profile({ user }) {
  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Profile</div>
          <div className="buttonContainer">
            <Link to="/update-profile" className="button">
              <MaterialSymbol className="icon" size={24} icon="edit" />
              <div className="text">Edit Profile</div>
            </Link>
            <Link to="/profile/settings" className="button">
              <MaterialSymbol className="icon" size={24} icon="settings" />
              <div className="text">Settings</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="profileContainer">
        <div className="profileTopBox">
          <div className="profilePicture">
            <img
              src={user.admin_picture ? user.admin_picture : dp}
              alt="Profile"
            />
          </div>
          <div className="details">
            <div className="name">{user.admin_name}</div>
            {/* <div className="userPoints">
              <MaterialSymbol className="icon" size={22} icon="star" fill />
              <div className="text">POINTS</div>
              <div className="point">1442{user.admin_points}</div>
            </div> */}
          </div>
        </div>

        <div className="profileDetails">
          {/* <div className="contributionSectionContainer">
            <ContributionBox
              icon="rewarded_ads"
            />
            <ContributionBox
              icon="auto_stories"
            />
            <ContributionBox
              icon="gallery_thumbnail"
            />
            <ContributionBox
              icon="group_add"
            />
          </div>
          <div className="contributionSectionContainer">
            <ContributionBox
              icon="work"
            />
            <ContributionBox
              icon="workspace_premium "
            />
            <ContributionBox
              icon="store"
            />
            <ContributionBox
              icon="notifications"
            />
          </div> */}
          <div className="profileDetailsSectionContainer">
            <ProfileSection title="Personal Information">
              <ProfileField
                icon="calendar_month"
                label="Date of Birth"
                value={extractDate(user.admin_date_of_birth)}
              />
              <ProfileField
                icon="group"
                label="Gender"
                value={user.admin_gender}
              />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField
                icon="call"
                label="Phone"
                value={user.admin_mobile_no}
              />
              <ProfileField
                icon="mail"
                label="Email"
                value={user.admin_email}
              />
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div className="profileDetailsSection">
      <h2 className="title">{title}</h2>
      {children}
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="profileSectionField">
      <MaterialSymbol className="icon" size={28} icon={icon} />
      <div className="texts">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
}

function ContributionBox({ icon }) {
  return (
    <div className="contributionBox">
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
    </div>
  );
}
