import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import 'react-material-symbols/rounded';
import ContestBox from "./ContestBox";

export default function PreviousContest() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/contests/previous")
      .then((response) => {
        const contestsData = response.data?.contests;
        setContests(contestsData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  if (contests.length) {
    return (
      <div className="scrollContainer">
        {contests.map((contest) => (
          <ContestBox
            key={contest.contest_id}
            id={contest.contest_id}
            name={contest.contest_name}
            details={contest.contest_details}
            category={contest.contest_category}
            organizerName={contest.organizer_name}
            organizerPicture={contest.organizer_picture}
            organizerId={contest.organizer_id}
            date={contest.start_time}
            startTime={contest.start_time}
            endTime={contest.end_time}
            participants={contest.participant_count}
            isOwn={contest.is_own}
            type="previous"
          />
        ))}
      </div>
    )
  }
  else {
      return <NotFound message="There are currently no Previous Contest!" />
  }
}