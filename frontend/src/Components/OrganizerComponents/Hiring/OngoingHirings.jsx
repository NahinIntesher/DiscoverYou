import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import HiringBox from "../../OrganizerComponents/Hiring/HiringBox";
import "react-material-symbols/rounded";


export default function OngoingWebinar({ setUpdate }) {
  const [hirings, setHirings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/hirings/ongoing")
      .then((response) => {
        const hiringsData = response.data.hirings;
        setHirings(hiringsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  if (hirings.length) {
    return (
      <div className="scrollContainer">
        {hirings.map((hiring) => (
          <HiringBox
            key={hiring.hiring_id}
            hiringId={hiring.hiring_id}
            companyName={hiring.company_name}
            jobName={hiring.job_name}
            jobCategory={hiring.job_category}
            jobDescription={hiring.job_description}
            organizerName={hiring.organizer_name}
            organizerId={hiring.organizer_id}
            setUpdate={setUpdate}
            startTime={hiring.start_time}
            endTime={hiring.end_time}
            calculatedTime={hiring.calculated_time}
            participants={hiring.participant_count}
            type="previous"
          />
        ))}
      </div>
    );
  } else {
    return <NotFound message="There are currently no Ongoing Webinar!" />;
  }
}
