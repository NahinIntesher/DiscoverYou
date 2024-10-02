import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import HiringBox from "./HiringBox";
import NotFound from "../../CommonComponents/NotFound";

export default function AllHiring() {
  const [hirings, setHirings] = useState([]);

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
    <div className="hiringBoxContainer">
      {
      hirings.length ?
      hirings.map((hiring) => (
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
      ))
      :
      <NotFound message="No Hiring Found!"/>
    }
    </div>
  );
}
