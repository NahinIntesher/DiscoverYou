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
            <img src={user.organizer_picture ? user.organizer_picture : dp} alt="Profile" />
          </div>
          <div className="details">
            <div className="name">{user.organizer_name}</div>
            <div className="userPoints">
              <MaterialSymbol className="icon" size={22} icon="star" fill />
              <div className="text">POINTS</div>
              <div className="point">1442{user.organizer_points}</div>
            </div>
          </div>
        </div>

        <div className="profileDetails">
          <div className="contributionSectionContainer">
            <ContributionBox
              count={93}
              title="Contests Participation"
              icon="rewarded_ads"
              secondaryCount={6}
              secondaryTitle="Contest Winner"
            />
            <ContributionBox
              count={13}
              title="Courses Enrolled"
              icon="auto_stories"
              secondaryCount={6}
              secondaryTitle="Course Completed"
            />
            <ContributionBox
              count={132}
              title="Showcase Posts"
              icon="gallery_thumbnail"
              secondaryCount={1340}
              secondaryTitle="Post Reactions"
            />
          </div>
          <div className="profileDetailsSectionContainer">
            <ProfileSection title="Personal Information">
              <ProfileField
                icon="calendar_month"
                label="Date of Birth"
                value={extractDate(user.organizer_date_of_birth)}
              />
              <ProfileField
                icon="group"
                label="Gender"
                value={user.organizer_gender}
              />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField
                icon="call"
                label="Phone"
                value={user.organizer_mobile_no}
              />
              <ProfileField
                icon="mail"
                label="Email"
                value={user.organizer_email}
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

function ContributionBox({
  count,
  title,
  secondaryCount,
  secondaryTitle,
  icon,
}) {
  return (
    <div className="contributionBox">
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
      <div className="secondDetail">
        <span className="count">{secondaryCount}</span>{" "}
        <span className="title">{secondaryTitle}</span>
      </div>
    </div>
  );
}
