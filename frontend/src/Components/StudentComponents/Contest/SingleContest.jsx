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
    problemSolutions: []
  });
  const [ mediaUrl, setMediaUrl] = useState(null)
  const [data, setData] = useState({
    contest: null,
    problems: [],
    participants: [],
    submissions: [],
  });
  const [isSubmitted, setSubmitted] = useState(false);
  const [isJoined, setJoined] = useState(false);
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

  const handleChangeAlt = (e, index) => {
    const { name, value } = e.target;
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`

    setFormData((prevState) => {
      const updatedSolutions = [...prevState.problemSolutions];  // Copy the current solutions array
      updatedSolutions[index] = value;  // Update the solution at the specific index
  
      return {
        ...prevState,
        problemSolutions: updatedSolutions  // Set the updated solutions array
      };
    });
  };


  const handleFileChange = (event) => {
    let mimetype = event.target.files[0].type;
    console.log(mimetype);
    if (mimetype.startsWith("image") || mimetype.startsWith("audio")) {
      setMediaUrl(URL.createObjectURL(event.target.files[0]));
      setFormData(function (oldFormData) {
        return {
          ...oldFormData,
          submissionMedia: [...Array.from(event.target.files)],
        };
      });
    } else {
      alert("File should be image!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/student/contests/${contestId}`)
      .then((response) => {
        setData(response.data);
        setSubmitted(response.data.contest.is_submitted);
        setJoined(response.data.contest.is_joined);
        setContestType(response.data.contest.contest_type);

        setFormData(function (oldFormData) {
          return {
            ...oldFormData,
            contestId: response.data.contest.contest_id,
            contestCategory: response.data.contest.contest_category,
          };
        });

        if(response.data.problems.length) {
          response.data.problems.forEach((problem,index) => {
            setFormData((prevState) => {
              const updatedSolutions = [...prevState.problemSolutions];  // Copy the current solutions array
              updatedSolutions[index] = "";  // Update the solution at the specific index
          
              return {
                ...prevState,
                problemSolutions: updatedSolutions  // Set the updated solutions array
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
  }, [contestId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data.contest) return <p>No contest data available</p>;

  function submission(e) {
    e.preventDefault();
    console.log(formData);

    const finalData = new FormData();

    finalData.append("contestId", formData.contestId);
    finalData.append("contestCategory", formData.contestCategory);
    finalData.append("submissionText", formData.submissionText);
    formData.submissionMedia.forEach((file, index) => {
      finalData.append(`submissionMedia`, file);
    });

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/contests/submission", finalData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("You submission is successfully uploaded!");
          // setUpdatePost((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  if(isJoined || contestType == "previous") {
    return (
      <div className="mainContent">
        <Header title={data.contest.contest_name} semiTitle={data.contest.contest_category + " Contest"} />
        <div className="webinarHeader">
          <div className="leftSection">
            <div className="name">{data.contest.contest_name}</div>
            <Category category={data.contest.contest_category} />
          </div>
          <div className="rightSection">

            <div className="joinButtonContainer">
              <div className="hostContainer">
                <Link to={"/profile/" + data.contest.organizer_id} className="host">
                  <div className="hostPicture">
                    <img
                      src={
                        data.contest.organizer_picture ? data.contest.organizer_picture : dp
                      }
                    />
                  </div>
                  <div className="hostDetails">
                    <div className="detailTitle">Organized By</div>
                    <div className="detailInfo">{data.contest.organizer_name}</div>
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
          <div className={activeTab == "contest" ? "activeTab" : "tab"} onClick={function () { setActiveTab("contest") }}>Contest Details</div>
          {
            (data.contest.contest_category == "Competitive Programming" || data.contest.contest_category == "Web/App Designing") &&
            <div className={activeTab == "problems" ? "activeTab" : "tab"} onClick={function () { setActiveTab("problems") }}>Contest Problems</div>
          }
          {
            data.contest.contest_type == "ongoing" &&
            <div className={activeTab == "submissions" ? "activeTab" : "tab"} onClick={function () { setActiveTab("submissions") }}>Contest Submissions</div>
          }
          <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function () { setActiveTab("participants") }}>{data.contest.contest_type == "previous" ? "Contest Results" : "Contest Participants"}</div>
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
              {
                (data.contest.contest_category == "Debating") ?
                <div className="onlineMeeting">
                  <MaterialSymbol className="icon" size={120} icon="interpreter_mode" />
                  <div className="title">This contest is running in Online Meeting</div>
                  <div className="joinButton">Join Meeting</div>
                </div>
                :
                isSubmitted ?
                <div className="submissionCompleted">
                  <MaterialSymbol className="icon" size={90} icon="check"/>
                  <div className="title">You uploaded your submission!</div>
                  <div className="semiTitle">You will be notified when contest result will be published</div>
                </div>
                : <form onSubmit={submission}>
                  <div className="title">Upload Your Submission</div>
                  {
                    (data.contest.contest_category == "Competitive Programming" || data.contest.contest_category == "Web/App Designing") &&
                    data.problems.map(function (problem, i) {
                      return (
                        <div className="input">
                          <label name="communityName">Problem {i + 1} Solution</label>
                          <textarea
                            onChange={(e)=>handleChangeAlt(e, i)}
                            type="text"
                            placeholder={`Write problem ${i + 1} solution`}
                          />
                        </div>
                      )
                    })
                  }
                  {
                    (data.contest.contest_category == "Writing") &&
                    <div className="input">
                      <label name="communityName">Your Literature</label>
                      <textarea
                        name="submissionText"
                        onChange={handleChange}
                        type="text"
                        className="longInput"
                        placeholder={`Write problem literature here.`}
                      />
                    </div>
                  }
                  {
                    (data.contest.contest_category == "Art & Craft" || data.contest.contest_category == "Graphics Designing"  || data.contest.contest_category == "Photography" ) &&
                    <div className="center">
                      <div className="currentMedia">
                        {
                          mediaUrl ?
                          <img
                            src={mediaUrl}
                            alt="profilePicute"
                          />
                          : <div className="noMedia">
                            No image uploaded!
                          </div>
                        }
                      </div>
                      <div className="uploadMedia">
                        <input
                          type="file"
                          name="submissionMedia"
                          onChange={handleFileChange}
                          accept="image/*"
                          multiple
                          required
                        />
                        Upload New Image
                      </div>
                    </div>
                  }
                  {
                    (data.contest.contest_category == "Singing") &&
                    <div className="center">
                      <div className="currentMedia audioPadding">
                        {
                          mediaUrl ?
                          <audio controls>
                            <source
                              src={mediaUrl}
                            />
                            Your browser does not support the audio element.
                          </audio>
                          : <div className="noMedia">
                            No audio uploaded!
                          </div>
                        }
                      </div>
                      <div className="uploadMedia">
                        <input
                          type="file"
                          name="submissionMedia"
                          onChange={handleFileChange}
                          accept="audio/*"
                          multiple
                          required
                        />
                        Upload New Audio
                      </div>
                    </div>
                  }
                  <button>Upload Submission</button>
                </form>
              }
            </div>
          </div>
        )}
      </div>
    );
  }
};

function Participant({ id, name, picture, position, isSubmitted, contestId }) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={picture ? picture : dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        <Link to={"/profile/" + id} className="viewProfile">View Profile</Link>
      </div>
      <div className="participantResult">
        <div className="submission">
          {isSubmitted ? 
            <Link to={`/contest/submission/${contestId}/${id}`} className="viewSubmission">View Submission</Link>
            :
            <div className="noSubmission">No Submission</div>
          }
        </div>
        <div className="position">
          Position
          <div className="count">{position}</div>
        </div>
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