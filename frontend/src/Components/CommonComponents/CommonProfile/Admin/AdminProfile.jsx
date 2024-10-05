import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../../assets/images/default.jpg";
import "../../../../assets/styles/Profile.css";

export default function AdminProfile({ user }) {
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
        </div>
      </div>
      <div className="profileContainer">
        <div className="profileTopBox">
          <div className="profilePicture">
            <img
              src={user.user_picture ? user.user_picture : dp}
              alt="Profile"
            />
          </div>
          <div className="details">
            <div className="name">{user.name}</div>
          </div>
        </div>

        <div className="profileDetails">
          <div className="profileDetailsSectionContainer">
            <ProfileSection title="Personal Information">
              <ProfileField
                icon="calendar_month"
                label="Date of Birth"
                value={extractDate(user.date_of_birth)}
              />
              <ProfileField
                icon="group"
                label="Gender"
                value={user.gender}
              />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField
                icon="call"
                label="Phone"
                value={user.mobile_no}
              />
              <ProfileField
                icon="mail"
                label="Email"
                value={user.email}
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