import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import "../../../assets/styles/contest.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/desert4.jpg";
import NotFound from "../../CommonComponents/NotFound";


const Singlecourse = () => {
  const { courseId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantNo, setParticipantNo] = useState(0);
  const [data, setData] = useState({
    course: null,
    participants: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("course");


  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }
  function notRegisteredError() {
    alert("Sorry, you didn't authority to add materials!");
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3000/admin/courses/${courseId}`)
      .then((response) => {
        console.log("Course API Response:", response.data.course);
        setData(response.data);
        setLoading(false);
        const course = response.data.course;
        setIsRegistered(course.is_joined);
        setParticipantNo(course.participant_count);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [participantNo]);

  function notRegisteredError() {
    alert("Sorry, you didn't have authority to add materials!");
  }

  if (loading) return <p>Loading...</p>;
  
  return (
    <div className="mainContent">
      <Header
        title={data.course.course_name}
        semiTitle={`${data.course.course_category} Course`}
      />
      <div className="webinarHeader">
        <div className="leftSection">
          <div className="name">{data.course.course_name}</div>
          <Category category={data.course.course_category} />
          <div className="hostContainer">
            <div className="host">
              <div className="hostPicture">
                <img src={dp} />
              </div>
              <div className="hostDetails">
                <div className="detailTitle">Organized By</div>
                <div className="detailInfo">{data.course.mentor_name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div className="joinButtonContainer">
              <button
                onClick={notRegisteredError}
                className="joinButton inactiveButton"
              >
                Add Materials
              </button>
            <div className="joinDetails">
              <b>Participant:</b> {participantNo}
            </div>
          </div>
        </div>
      </div>
      <div className="tabContainer">
        <div className={activeTab == "course" ? "activeTab" : "tab"} onClick={function () { setActiveTab("course") }}>course Details</div>
        <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function () { setActiveTab("participants") }}>course Participants</div>
      </div>

      {activeTab === "course" && (
        <div className="content center">
          <div className="detailsSection">
            <ProfileField
              icon="subject"
              label="Description"
              value={data.course.course_description}
            />
          </div>
        </div>
      )}
      {activeTab === "participants" && (
        <div className="content center">
          {data.participants.length > 0 ? (
            <div className="participantList">
              {data.participants.map((participant) =>
                <Participant key={participant.participant_id} name={participant.participant_name} />
              )}
            </div>
          ) : (
            <NotFound message={"No participant found!"} />
          )}
        </div>
      )}
    </div>
  );
};

function Participant({ name }) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        <div className="viewProfile">View Profile</div>
      </div>
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

function Category({ category }) {
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

export default Singlecourse;