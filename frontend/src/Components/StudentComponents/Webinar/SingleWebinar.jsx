import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import "../../../assets/styles/contest.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import NotFound from "../../CommonComponents/NotFound";


const SingleWebinar = () => {
  const { webinarId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantNo, setParticipantNo] = useState(0);
  const [data, setData] = useState({
    webinar: null,
    participants: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("webinar");
  const [webinarType, setWebinarType] = useState("");


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

  useEffect(() => {
    axios
      .get(`http://localhost:3000/student/webinar/${webinarId}`)
      .then((response) => {
        console.log("Full API Response:", response.data.webinar);
        setData(response.data);
        setLoading(false);
        const webinar = response.data.webinar;

        setWebinarType(webinar.webinar_type);
        setIsRegistered(webinar.is_joined);
        setParticipantNo(webinar.participant_count);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [participantNo]);

  function registerWebinar() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/webinars/register", {
        webinarId: webinarId,
      })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "Registered") {
          setIsRegistered(true);
          setParticipantNo((prevValue) => prevValue + 1);
        } else if (res.data.status === "Unregistered") {
          setIsRegistered(false);
          setParticipantNo((prevValue) => prevValue - 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }
  function notRegisteredError() {
    alert("Sorry, you didn't registered for this webinar!");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mainContent">
      <Header
        title={data.webinar.webinar_name}
        semiTitle={`${data.webinar.webinar_category} Webinar`}
      />
      <div className="webinarHeader">
        <div className="leftSection">
          <div className="name">{data.webinar.webinar_name}</div>
          <Category category={data.webinar.webinar_category} />
          <div className="hostContainer">
            <div className="host">
              <div className="hostPicture">
                <img src={data.webinar.host_picture ? data.webinar.host_picture : dp} />
              </div>
              <div className="hostDetails">
                <div className="detailTitle">Organized By</div>
                <div className="detailInfo">{data.webinar.host_name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div className="joinButtonContainer">
            {webinarType == "ongoing" ? (
              isRegistered ? (
                <a href={data.webinar.meeting_link} className="joinButton">
                  Join Meeting
                </a>
              ) : (
                <button
                  onClick={notRegisteredError}
                  className="joinButton inactiveButton"
                >
                  Join Meeting
                </button>
              )
            ) : webinarType == "upcoming" ? (
              isRegistered ? (
                <button className="joinButton" onClick={registerWebinar}>
                  Unregister
                </button>
              ) : (
                <button className="joinButton" onClick={registerWebinar}>
                  Register
                </button>
              )
            ) : (
              <a href={data.webinar.recorded_link} className="joinButton">
                Watch Record
              </a>
            )}
            <div className="joinDetails">
              <b>Participant:</b> {participantNo}
            </div>
          </div>
        </div>
      </div>
      <div className="tabContainer">
        <div className={activeTab == "webinar" ? "activeTab" : "tab"} onClick={function () { setActiveTab("webinar") }}>Webinar Details</div>
        <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function () { setActiveTab("participants") }}>Webinar Participants</div>
      </div>

      {activeTab === "webinar" && (
        <div className="content center">
          <div className="detailsSection">
            <ProfileField
              icon="subject"
              label="Description"
              value={data.webinar.webinar_description}
            />
            <ProfileField
              icon="calendar_month"
              label="Date"
              value={getDate(data.webinar.start_time)}
            />
            <ProfileField
              icon="schedule"
              label="Time"
              value={getPMTime(data.webinar.start_time) + " - " + getPMTime(data.webinar.end_time)}
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

export default SingleWebinar;