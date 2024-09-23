import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/desert4.jpg";



export default function Profile({ user }) {
  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
            <Link to="/settings" className="button">
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
              src={dp} 
              alt="Profile"
            />
          </div>
          <div className="details">
            <div className="name">{user.student_name}</div>
            <div className="userPoints">        
              <MaterialSymbol className="icon" size={22} icon="star" fill/>
              <div className="text">POINTS</div> 
              <div className="point">1,42{user.student_points}</div>
            </div>
            <div className="interests">
              {user.interests.map(function(interest) {
                return (<Interest category={interest}/>)
              }) 
              }
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
                value={extractDate(user.student_date_of_birth)}
              />
              <ProfileField icon="group" label="Gender" value={user.student_gender} />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField icon="call" label="Phone" value={user.student_mobile_no} />
              <ProfileField icon="mail" label="Email" value={user.student_email} />
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
      <MaterialSymbol className="icon" size={28} icon={icon}/>
      <div className="texts">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
}

function Interest({category}) {
  return(
    <div className="userInterest">
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
        <MaterialSymbol
          className="icon"
          size={24}
          icon="sports_esports"
        />
      )}
      <div className="text">{category}</div>
    </div>
  )
}

function ContributionBox({count, title, secondaryCount, secondaryTitle, icon}) {
  return(
    <div className="contributionBox">
      <MaterialSymbol className="icon" size={50} icon={icon}/>
      <MaterialSymbol className="floatedIcon" size={180} icon={icon}/>
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
      <div className="secondDetail">
        <span className="count">{secondaryCount}</span>{" "}
        <span className="title">{secondaryTitle}</span>
      </div>
    </div> 
  )
}