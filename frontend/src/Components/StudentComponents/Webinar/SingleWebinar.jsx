import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import "../../../assets/styles/contest.css";

const SingleWebinar = () => {
  const { webinarId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantNo, setParticipantNo] = useState(0);
  const [data, setData] = useState({
    webinar: null,
    participants: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("webinar");
  const [webinarType, setwebinarType] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/student/webinar/${webinarId}`)
      .then((response) => {
        console.log("Full API Response:", response.data.webinar);
        setData(response.data);
        setLoading(false);
        const webinar = response.data.webinar;
        const now = new Date();

        if (new Date(webinar.end_time) < now) {
          setwebinarType("previous");
        } else if (new Date(webinar.start_time) > now) {
          setwebinarType("upcoming");
        } else {
          setwebinarType("ongoing");
        }
        setIsRegistered(webinar.is_joined);
        setParticipantNo(webinar.participant_count);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [webinarId]);

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
  if (error) return <p>{error}</p>;
  if (!data.webinar) return <p>No webinar data available</p>;

  return (
    <div className="mainContent">
      <Header
        title={data.webinar.webinar_name}
        semiTitle={`${data.webinar.webinar_category} Webinar`}
      />
      <div className="container p-6">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "webinar" ? "active" : ""}`}
            onClick={() => setActiveTab("webinar")}
          >
            Webinar Details
          </button>
          <button
            className={`tab-button ${
              activeTab === "participants" ? "active" : ""
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Webinar Participants
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "webinar" && (
            <div className="content-section">
              <p>
                <strong>Description:</strong> {data.webinar.webinar_description}
              </p>
              <p>
                <strong>Category:</strong> {data.webinar.webinar_category}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new Date(data.webinar.start_time).toLocaleString()}
              </p>
              <p>
                <strong>End Time:</strong>{" "}
                {new Date(data.webinar.end_time).toLocaleString()}
              </p>
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
                  <strong>Participant:</strong> {participantNo}
                </div>
              </div>
            </div>
          )}
          {activeTab === "participants" && (
            <div className="content-section">
              {data.participants.length > 0 ? (
                <ul>
                  {data.participants.map((participant, index) => (
                    <li className="mb-2" key={participant.participant_id}>
                      {index + 1}. {participant.participant_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No participants registered yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleWebinar;
