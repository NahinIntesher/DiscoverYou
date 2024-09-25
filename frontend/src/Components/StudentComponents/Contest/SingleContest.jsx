import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ContestProblems from "./ContestProblems";
import ContestParticipants from "./ContestParticipants";
import ContestSubmissions from "./ContestSubmissions";
import './SingleContest.css'; // Adjust the path as necessary
import Header from "../../CommonComponents/Header";

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
      .get(`http://localhost:3000/student/contest/${contestId}`)
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
      <Header title={data.contest.contest_name} semiTitle={data.contest.contest_category+" Contest"}/>

      <div className="tabContainer">
          <div className={activeTab == "problems" ? "activeTab" : "tab"} onClick={function(){setActiveTab("problems")}}>Contest Problems</div>
          <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function(){setActiveTab("participants")}}>Contest Participants</div>
          <div className={activeTab == "submissions" ? "activeTab" : "tab"} onClick={function(){setActiveTab("submissions")}}>Contest Submissions</div>
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

export default SingleContest;