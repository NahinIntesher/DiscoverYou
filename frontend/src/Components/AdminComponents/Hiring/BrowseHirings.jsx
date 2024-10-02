import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import HiringBox from "./HiringBox";
import { MaterialSymbol } from "react-material-symbols";
// import MyWebinars from "./MyHirings";
import { Link } from "react-router-dom";

export default function BrowseHiring({ user }) {
  const [hirings, setHirings] = useState([]);
  const [pendingHiringsNo, setPendingHiringsNo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings/pending")
      .then((res) => {
        const pendingHiringsNo = res.data?.hirings || [];
        setPendingHiringsNo(pendingHiringsNo.length);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings")
      .then((response) => {
        const hiringsData = response.data.hirings;
        setHirings(hiringsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  return (
    <div className="tabContent">
      {pendingHiringsNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            Your {pendingHiringsNo} hirings approval are in pending.
          </div>
          <Link to={"/hiring/pending"} className="button">
            Pending Hirings
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
            startTime={hiring.start_time}
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
