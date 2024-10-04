import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ContestProblems from "./ContestProblems";
import ContestParticipants from "./ContestParticipants";
import ContestSubmissions from "./ContestSubmissions";
import Header from "../../CommonComponents/Header";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";


const SingleContest = () => {
  const { contestId } = useParams();
  const [data, setData] = useState({
    contest: null,
    problems: [],
    participants: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("problems");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/student/contests/${contestId}`)
      .then((response) => {
        setData(response.data);
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
        <div className={activeTab == "problems" ? "activeTab" : "tab"} onClick={function () { setActiveTab("problems") }}>Contest Problems</div>
        <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function () { setActiveTab("participants") }}>Contest Participants</div>
        <div className={activeTab == "submissions" ? "activeTab" : "tab"} onClick={function () { setActiveTab("submissions") }}>Contest Submissions</div>
      </div>
      <div className="container p-5">
        <div className="tab-content">
          {activeTab === "problems" && (
            <div className="content-section blue">
              <h3 className="section-title">Contest Problems</h3>
              <ContestProblems problems={data.problems} />
            </div>
          )}
          {activeTab === "participants" && (
            <div className="content-section green">
              <h3 className="section-title">Contest Participants</h3>
              <ContestParticipants participants={data.participants} />
            </div>
          )}
          {activeTab === "submissions" && (
            <div className="content-section yellow">
              <h3 className="section-title">Contest Submissions</h3>
              <ContestSubmissions submissions={data.submissions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


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