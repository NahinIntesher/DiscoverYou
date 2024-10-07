import React, { useState, useEffect } from "react";
import axios from "axios";
import PendingHiringBox from "./PendingHiringBox";
import NotFound from "../../CommonComponents/NotFound";

export default function PendingWebinar({ interests }) {
  const [pendingHirings, setPendingHirings] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/hirings/pending")
      .then((res) => {
        const pendingHirings = res.data?.hirings || [];
        setPendingHirings(pendingHirings);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, [update]);

  return (
    <div className="pendingMembersList">
      {pendingHirings.length ? (
        pendingHirings.map(function (hiring) {
          return (
            <PendingHiringBox
              key={hiring.hiring_id}
              hiringId={hiring.hiring_id}
              organizerId={hiring.organizer_id}
              organizerName={hiring.organizer_name}
              organizerPicture={hiring.organizer_picture}
              companyName={hiring.company_name}
              jobName={hiring.job_name}
              jobCategory={hiring.job_category}
              jobDescription={hiring.job_description}
              lastDate={hiring.end_time}
              jobSalery={hiring.job_salary}
              applicantsCount={hiring.applicant_count}
              calculatedTime={hiring.calculated_time}
              setUpdate={setUpdate}
            />
          );
        })
      ) : (
        <NotFound message={"You have no pending Hirings!"} />
      )}
    </div>
  );
}
