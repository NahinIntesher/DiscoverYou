import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../../assets/images/default.jpg";
import "../../../../assets/styles/Profile.css";
import axios from "axios";

export default function StudentProfile({ user, interests }) {
  const [contestResults, setContestResults] = useState({});
  const [showcaseResults, setShowcaseResults] = useState({});
  const [courseResults, setCourseResults] = useState({});
  const [webinarResults, setWebinarResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/student/common-profile", {
        params: { userId: user.id },
      })
      .then((res) => {
        console.log(res.data);
        setContestResults(res.data.contestResults);
        setShowcaseResults(res.data.showcaseResults);
        setCourseResults(res.data.courseResults);
        setWebinarResults(res.data.webinarResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

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
            <div className="userPoints">
              <MaterialSymbol className="icon" size={22} icon="star" fill />
              <div className="text">POINTS</div>
              <div className="point">{user.points}</div>
            </div>
            <div className="interests">
              {interests.map(function (interest) {
                return <Interest key={interest} category={interest} />;
              })}
            </div>
          </div>
        </div>

        <div className="profileDetails">
          <div className="contributionSectionContainer">
            <ContributionBox
              count={contestResults.total_contests}
              title="Contests Participation"
              icon="rewarded_ads"
              secondaryCount={contestResults.rank_1_count}
              tertiaryCount={contestResults.rank_2_count}
              secondaryTitle="Winner"
              tertiaryTitle="Runner-up"
              linkToRoute={`contestResults/${user.id}`}
            />
            <ContributionBox
              count={courseResults.course_count}
              title="Courses Enrollement"
              icon="auto_stories"
              secondaryCount={courseResults.course_count}
              secondaryTitle="Completed"
              linkToRoute={`courseResults/${user.id}`}
            />
            <ContributionBox
              count={showcaseResults.total_posts}
              title="Showcase Section Posts"
              icon="gallery_thumbnail"
              secondaryCount={showcaseResults.total_reactions}
              secondaryTitle="Reactions"
              linkToRoute={`showcaseResults/${user.id}`}
            />
            <ContributionBox
              count={webinarResults.webinar_count}
              title="Webinars Attended"
              icon="patient_list"
              // secondaryCount={showcaseResults.total_reactions}
              secondaryTitle="No talks"
              linkToRoute={`webinarResults/${user.id}`}
            />
          </div>
          <div className="profileDetailsSectionContainer">
            <ProfileSection title="Personal Information">
              <ProfileField
                icon="calendar_month"
                label="Date of Birth"
                value={extractDate(user.date_of_birth)}
              />
              <ProfileField icon="group" label="Gender" value={user.gender} />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField icon="call" label="Phone" value={user.mobile_no} />
              <ProfileField icon="mail" label="Email" value={user.email} />
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

function Interest({ category }) {
  return (
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
        <MaterialSymbol className="icon" size={24} icon="sports_esports" />
      )}
      <div className="text">{category}</div>
    </div>
  );
}

function ContributionBox({
  count,
  title,
  secondaryCount,
  tertiaryCount,
  secondaryTitle,
  tertiaryTitle,
  icon,
  linkToRoute,
}) {
  return (
    <Link to={`/profile/${linkToRoute}`} className="contributionBox">
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
      <div className="secondDetail">
        <div className="spanContainer">
          <span className="count">{secondaryCount}</span>
          <span className="title">{secondaryTitle}</span>
        </div>

        <div className="spanContainer">
          <span className="count">{tertiaryCount}</span>
          <span className="title">{tertiaryTitle}</span>
        </div>
      </div>
    </Link>
  );
}
