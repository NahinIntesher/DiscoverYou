import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import "../../../assets/styles/contest.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import NotFound from "../../CommonComponents/NotFound";

const SingleHiring = () => {
  const { hiringId } = useParams();
  const [applicantNo, setApplicantNo] = useState(0);
  const [data, setData] = useState({
    hiring: null,
    applicants: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hiring");
  const [hiringType, setHiringType] = useState("");

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
      .get(`http://localhost:3000/organizer/hirings/${hiringId}`)
      .then((response) => {
        console.log("Full API Response:", response.data.hiring);
        setData(response.data);
        setLoading(false);
        const hiring = response.data.hiring;

        setHiringType(hiring.hiring_type);
        setApplicantNo(hiring.applicant_count);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [applicantNo]);

  function notAvailableError() {
    alert("Sorry, hiring is not finished!");
  }

  function applyJob() {
    axios.post(`http://localhost:3000/organizer/hirings/apply`).then((response) => {
      console.log("Full API Response:", response.data);
      if (response.data.status === "success") {
        setApplicantNo(applicantNo + 1);
      } else {
        notAvailableError();
      }
    });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mainContent">
      <Header
        title={data.hiring.job_name}
        semiTitle={`${data.hiring.job_category} hiring`}
      />
      <div className="webinarHeader">
        <div className="leftSection">
          <div className="name">{data.hiring.company_name}</div>
          <Category category={data.hiring.job_category} />
          <div className="hostContainer">
            <div className="host">
              <div className="hostPicture">
                <img src={data.hiring.organizer_picture ? data.hiring.organizer_picture : dp} />
              </div>
              <div className="hostDetails">
                <div className="detailTitle">Organized By</div>
                <div className="detailInfo">{data.hiring.organizer_name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div className="joinButtonContainer">
            <button className="joinButton" onClick={applyJob}>Apply now</button>
            <div className="joinDetails">
              <b>Applicants:</b> {applicantNo}
            </div>
          </div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "hiring" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("hiring");
          }}
        >
          Hiring Details
        </div>
        <div
          className={activeTab == "applicants" ? "activeTab" : "tab"}
          onClick={function () {
            setActiveTab("applicants");
          }}
        >
          Hiring Applicants
        </div>
      </div>

      {activeTab === "hiring" && (
        <div className="content center">
          <div className="detailsSection">
            <ProfileField
              icon="subject"
              label="Description"
              value={data.hiring.job_description}
            />
            <ProfileField
              icon="calendar_month"
              label="Date"
              value={getDate(data.hiring.start_time)}
            />
            <ProfileField
              icon="schedule"
              label="Time"
              value={
                getPMTime(data.hiring.start_time) +
                " - " +
                getPMTime(data.hiring.end_time)
              }
            />
          </div>
        </div>
      )}
      {activeTab === "applicants" && (
        <div className="content center">
          {data.applicants.length > 0 ? (
            <div className="participantList">
              {data.applicants.map((applicant) => (
                <Applicant
                  key={applicant.applicant_id}
                  name={applicant.applicant_name}
                />
              ))}
            </div>
          ) : (
            <NotFound message={"No applicant found!"} />
          )}
        </div>
      )}
    </div>
  );
};

function Applicant({ name }) {
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

export default SingleHiring;
