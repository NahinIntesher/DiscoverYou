import React, { useState } from "react";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../../../assets/images/default.jpg";
import { Link } from "react-router-dom";

export default function CourseBox({
  id,
  name,
  category,
  description,
  mentorName,
  mentorId,
  mentorPicture,
  isJoined,
  totalMember,
}) {
  const [joinStatus, setJoinStatus] = useState(isJoined);

  function joinCourse() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/course/join", {
        courseId: id,
      })
      .then((res) => {
        if (res.data.status === "Registered") {
          setJoinStatus("pending");
          setParticipantNo((prevValue) => prevValue + 1);
        } else if (res.data.status === "Unregistered") {
          setJoinStatus("no");
          setParticipantNo((prevValue) => prevValue - 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="communityBox">
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
        <Link to={"profile/" + mentorId} className="organizer">
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
  );
}
