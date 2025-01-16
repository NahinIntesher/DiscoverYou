import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ContestProblems from "./ContestProblems";
import Header from "../../CommonComponents/Header";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import NotFound from "../../CommonComponents/NotFound";

const SingleContest = () => {
  const { contestId } = useParams();
  const [formData, setFormData] = useState({
    contestId: "",
    contestCategory: "",
    submissionText: "",
    submissionMedia: [],
    problemSolutions: [],
  });
  const [mediaUrl, setMediaUrl] = useState(null);
  const [data, setData] = useState({
    contest: null,
    problems: [],
    participants: [],
    submissions: [],
    points: [],
  });
  const [participantResults, setParticipantResults] = useState([]);
  const [isResultGiven, setResultGiven] = useState(false);
  const [isOwn, setOwn] = useState(false);
  const [contestType, setContestType] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("contest");

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

  const handleChange = (e, participantId) => {
    const { value } = e.target;

    setParticipantResults((prevState) => {
      // console.log("Gullo");
      const updatedParticipants = prevState.map((participant) => {
        if (participant.participant_id == participantId) {
          return {
            ...participant,
            result_position: value,
          };
        }
        return participant;
      });

      return updatedParticipants;
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/organizer/contests/${contestId}`)
      .then((response) => {
        setData(response.data);
        setParticipantResults(response.data.participants);
        setResultGiven(response.data.contest.result_given);
        setOwn(response.data.contest.is_own);
        setContestType(response.data.contest.contest_type);

        setFormData(function (oldFormData) {
          return {
            ...oldFormData,
            contestId: response.data.contest.contest_id,
            contestCategory: response.data.contest.contest_category,
          };
        });

        if (response.data.problems.length) {
          response.data.problems.forEach((problem, index) => {
            setFormData((prevState) => {
              const updatedSolutions = [...prevState.problemSolutions]; // Copy the current solutions array
              updatedSolutions[index] = ""; // Update the solution at the specific index

              return {
                ...prevState,
                problemSolutions: updatedSolutions, // Set the updated solutions array
              };
            });
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [isResultGiven]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data.contest) return <p>No contest data available</p>;

  const submission = async (e) => {
    e.preventDefault();

    const sortedParticipants = [...participantResults].sort(
      (a, b) => b.result_position - a.result_position
    );

    const updatedParticipants = sortedParticipants.map((participant, index) => {
      return {
        ...participant,
        result_position: index + 1,
        points_got: index == 0 ? 50 : index == 1 ? 30 : index == 2 ? 20 : 0,
      };
    });

    // console.log(updatedParticipants);

    try {
      axios.defaults.withCredentials = true;
      const resultGivingResponse = await axios.post(
        "http://localhost:3000/organizer/contests/give-result",
        {
          participants: updatedParticipants,
          contestId: data.contest.contest_id,
        }
      );

      if (resultGivingResponse.data.status === "Success") {
        alert("Result has been successfully uploaded!");
        setResultGiven(true);
        setActiveTab("participants");
      }
      // if (resultGivingResponse.data.status === "Success") {
      //   const notificationPromises = updatedParticipants.map((participant) =>
      //     axios.post("http://localhost:3000/student/notifications", {
      //       recipientId: participant.participant_id,
      //       notificationPicture: user.organizer_picture,
      //       notificationTitle: "Contest Result Given",
      //       notificationMessage: `Result of ${data.contest.contest_name} has been published!`,
      //       notificationLink: `/contest/${data.contest.contest_id}`
      //     })
      //       .catch((error) => {
      //         console.error("Error fetching contests:", error);
      //       })
      //   );

      //   await Promise.all(notificationPromises);
      // alert("Result has been successfully uploaded!");
      // setResultGiven(true);
      // setActiveTab("participants");
      // } else {
      //   console.error("Checkout failed:", resultGivingResponse.data.Error);
      //   alert("Result publishing failed. Please try again.");
      // }
    } catch (error) {
      console.error("An error occurred during result publising:", error);
      alert("An error occurred during result publishing. Please try again.");
    }
  };

  if (isOwn || contestType == "previous") {
    return (
      <div className="mainContent">
        <Header
          title={data.contest.contest_name}
          semiTitle={data.contest.contest_category + " Contest"}
        />
        <div className="webinarHeader">
          <div className="leftSection">
            <div className="name">{data.contest.contest_name}</div>
            <Category category={data.contest.contest_category} />
          </div>
          <div className="rightSection">
            <div className="joinButtonContainer">
              <div className="hostContainer">
                <Link
                  to={"/profile/" + data.contest.organizer_id}
                  className="host"
                >
                  <div className="hostPicture">
                    <img
                      src={
                        data.contest.organizer_picture
                          ? data.contest.organizer_picture
                          : dp
                      }
                    />
                  </div>
                  <div className="hostDetails">
                    <div className="detailTitle">Organized By</div>
                    <div className="detailInfo">
                      {data.contest.organizer_name}
                    </div>
                  </div>
                </Link>
              </div>
              <div className="joinDetails">
                <b>Participant:</b> {data.contest.participant_count}
              </div>
            </div>
          </div>
        </div>
        <div className="tabContainer">
          <div
            className={activeTab == "contest" ? "activeTab" : "tab"}
            onClick={function () {
              setActiveTab("contest");
            }}
          >
            Contest Details
          </div>
          {(data.contest.contest_category == "Competitive Programming" ||
            data.contest.contest_category == "Web/App Designing") && (
            <div
              className={activeTab == "problems" ? "activeTab" : "tab"}
              onClick={function () {
                setActiveTab("problems");
              }}
            >
              Contest Problems
            </div>
          )}
          {isOwn ? (
            data.contest.contest_type == "previous" &&
            !isResultGiven && (
              <div
                className={activeTab == "submissions" ? "activeTab" : "tab"}
                onClick={function () {
                  setActiveTab("submissions");
                }}
              >
                Submit Results
              </div>
            )
          ) : (
            <></>
          )}
          <div
            className={activeTab == "participants" ? "activeTab" : "tab"}
            onClick={function () {
              setActiveTab("participants");
            }}
          >
            {data.contest.contest_type == "previous"
              ? "Contest Results"
              : "Contest Participants"}
          </div>
        </div>
        {activeTab === "contest" && (
          <div className="content center">
            <div className="detailsSection">
              <ProfileField
                icon="subject"
                label="Description"
                value={data.contest.contest_details}
              />
              <ProfileField
                icon="calendar_month"
                label="Date"
                value={getDate(data.contest.start_time)}
              />
              <ProfileField
                icon="schedule"
                label="Time"
                value={
                  getPMTime(data.contest.start_time) +
                  " - " +
                  getPMTime(data.contest.end_time)
                }
              />
            </div>
          </div>
        )}
        {activeTab === "problems" && (
          <ContestProblems problems={data.problems} />
        )}
        {activeTab === "participants" && (
          <div className="content center">
            {data.participants.length ? (
              <div className="participantList">
                {data.participants.map((participant) => (
                  <Participant
                    key={participant.participant_id}
                    id={participant.participant_id}
                    name={participant.participant_name}
                    position={participant.result_position}
                    picture={participant.participant_picture}
                    isSubmitted={participant.is_submitted}
                    contestId={data.contest.contest_id}
                    resultGiven={data.contest.result_given}
                    contestType={data.contest.contest_type}
                  />
                ))}
              </div>
            ) : (
              <NotFound message={"No participant found!"} />
            )}
          </div>
        )}
        {activeTab === "submissions" && (
          <div className="content center">
            <div className="submissionContainer">
              <form onSubmit={submission}>
                <div className="title">Give Contest Result</div>
                <div>
                  {data.participants.length ? (
                    data.participants.map((participant) => {
                      return (
                        <ParticipantResultGiveBox
                          key={participant.participant_id}
                          id={participant.participant_id}
                          name={participant.participant_name}
                          isSubmitted={participant.is_submitted}
                          picture={participant.participant_picture}
                          contestId={data.contest.contest_id}
                          handleChange={handleChange}
                        />
                      );
                    })
                  ) : (
                    <NotFound message="This contest have no participant!" />
                  )}
                </div>
                <button>Upload Contest Result</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
};

function Participant({
  id,
  name,
  contestType,
  picture,
  position,
  isSubmitted,
  contestId,
  resultGiven,
}) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={picture ? picture : dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        <Link to={"/profile/" + id} className="viewProfile">
          View Profile
        </Link>
      </div>
      <div className="participantResult">
        {contestType != "upcoming" && (
          <div className="submission">
            {isSubmitted ? (
              <Link
                to={`/contest/submission/${contestId}/${id}`}
                className="viewSubmission"
              >
                View Submission
              </Link>
            ) : (
              <div className="noSubmission">No Submission</div>
            )}
          </div>
        )}
        {resultGiven ? (
          <div className="position">
            Position
            <div className="count">{position}</div>
          </div>
        ) : (
          contestType == "previous" && (
            <div className="position">
              Result Not
              <br />
              Published
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ParticipantResultGiveBox({
  id,
  name,
  picture,
  isSubmitted,
  contestId,
  handleChange,
}) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={picture ? picture : dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        {isSubmitted ? (
          <Link
            to={`/contest/submission/${contestId}/${id}`}
            className="viewSubmission"
          >
            View Submission
          </Link>
        ) : (
          <div className="noSubmission">No Submission</div>
        )}
      </div>
      <div className="input">
        <label>Scores (Out of 100)</label>
        <input
          type="number"
          onChange={(e) => handleChange(e, id)}
          placeholder={`Give score`}
        />
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

export default SingleContest;
