import React, { useState } from "react";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../../assets/images/desert4.jpg";
import { Link } from "react-router-dom";

export default function EnrolledCourseBox({
  id,
  name,
  category,
  description,
  mentorName,
  mentorPicture,
  mentorId,
  isJoined,
  completedPercentage,
  totalMember,
}) {
  const [joinStatus, setJoinStatus] = useState(isJoined);

  return (
    <div className="courseBox">
      <div className="others">
        <div className="informationContainer">
          <div className="information">
            <div className="title">{name}</div>
            <div className="category">
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
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="photo_camera"
                />
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
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="communication"
                />
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
          </div>
          {/* <div className="joinButtonContainer">
                        {joinStatus == "yes" ? (
                            <Link to={"/course/"+id} className="joinButton">Enter</Link>
                        ) : joinStatus == "pending" ? (
                            <div onClick={joinCourse} className="joinButton">Requested</div>
                        ) : (
                            <div onClick={joinCourse} className="joinButton">Join</div>
                        ) 
                        }
                        <div className="joinDetails">
                            Member: <b>{totalMember}</b>
                        </div>
                    </div> */}
        </div>
        <div className="detailsContainer">
          <div className="description">
            <div className="titles">Course Description</div>
            <div className="text">{description}</div>
          </div>
          <Link to={"/profile/" + mentorId} className="organizer">
            <div className="organizerPicture">
              <img src={mentorPicture ? mentorPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Mentored By</div>
              <div className="detailInfo">{mentorName}</div>
            </div>
          </Link>
        </div>
      </div>
      <div className="progressBarContainer">
        <div
          className="progressBar"
          style={{
            backgroundImage:
              "conic-gradient(rgb(var(--medium)), rgb(var(--dark)), rgb(var(--medium)) " +
              completedPercentage +
              "%, rgba(0,0,0,0.15) 0)",
          }}
        >
          <div className="progress">{parseInt(completedPercentage)}%</div>
        </div>
        <div className="name">Completed</div>
      </div>
    </div>
  );
}
