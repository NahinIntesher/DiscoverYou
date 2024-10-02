import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import HiringBox from "./HiringBox";
import { MaterialSymbol } from "react-material-symbols";
// import MyWebinars from "./MyHirings";
import { Link } from "react-router-dom";

export default function Hiring({ user }) {
  const [hirings, setHirings] = useState([]);
  const [applyPendingNo, setApplyPendingNo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/hirings")
      .then((response) => {
        const hiringsData = response.data.hirings;
        const applyPendingData = response.data.applyPending;
        setHirings(hiringsData);
        setApplyPendingNo(applyPendingData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Hirings</div>
        </div>
      </div>
      {applyPendingNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            You applied for {applyPendingNo} jobs are in pending.
          </div>
          <Link to={"/hiring/applications"} className="button">
            Pending Application
          </Link>
        </div>
      )}
      <div className="hiringBoxContainer">
        
        {hirings.map((hiring) => (
          <HiringBox
            key={hiring.hiring_id}
            hiringId={hiring.hiring_id}
            organizerId={hiring.organizer_id}
            organizerName={hiring.organizer_name}
            organizerPicture={hiring.organizer_picture}
            companyName={hiring.company_name}
            jobName={hiring.job_name}
            jobCategory={hiring.job_category}
            jobDescription={hiring.job_description}
            endTime={hiring.end_time}
            jobSalery={hiring.job_salary}
            applicantsCount={hiring.applicant_count}
            calculatedTime={hiring.calculated_time}
          />
        ))}
      </div>
    </div>
  );
}
