import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import ContestBox from "./ContestBox";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";

export default function Contest() {
  const [previousContests, setPreviousContests] = useState([]);
  const [ongoingContests, setOngoingContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/contest")
      .then((res) => {
        console.log("Full API Response:", res); // Check response structure
        const contests = res.data.contests;
        const now = new Date();

        const previous = contests.filter(
          (contest) => new Date(contest.end_time) < now
        );
        const ongoing = contests.filter(
          (contest) =>
            new Date(contest.start_time) <= now &&
            new Date(contest.end_time) >= now
        );
        const upcoming = contests.filter(
          (contest) => new Date(contest.start_time) > now
        );

        setPreviousContests(previous);
        setOngoingContests(ongoing);
        setUpcomingContests(upcoming);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Contest</div>
        </div>
      </div>
      <div className="content">
        <div className="contentSemiTitle">Ongoing Contests</div>
        {ongoingContests.length ? (
          <div className="scrollContainer">
            {ongoingContests.map((contest) => (
              <ContestBox
                key={contest.contest_id}
                id={contest.contest_id}
                name={contest.contest_name}
                details={contest.contest_details}
                category={contest.contest_category}
                organizer={contest.organizer}
                date={contest.start_time}
                startTime={contest.start_time}
                endTime={contest.end_time}
                participants={contest.participant_count}
                calculatedTime={contest.calculated_time}
                type="ongoing"
              />
            ))}
          </div>
        ) : (
          <NotFound message="There are currently no Ongoing Contest!" />
        )}

        <div className="miniBreak"></div>
        <div className="contentSemiTitle">Upcoming Contests</div>
        <div className="scrollContainer">
          {upcomingContests.map((contest) => (
            <ContestBox
              key={contest.contest_id}
              id={contest.contest_id}
              name={contest.contest_name}
              details={contest.contest_details}
              category={contest.contest_category}
              organizer={contest.organizer}
              date={contest.start_time}
              startTime={contest.start_time}
              endTime={contest.end_time}
              participants={contest.participant_count}
              calculatedTime={contest.calculated_time}
              type="upcoming"
            />
          ))}
        </div>

        <div className="miniBreak"></div>
        <div className="contentSemiTitle">Previous Contests</div>
        <div className="scrollContainer">
          {previousContests.map((contest) => (
            <ContestBox
              key={contest.contest_id}
              id={contest.contest_id}
              name={contest.contest_name}
              details={contest.contest_details}
              category={contest.contest_category}
              organizer={contest.organizer}
              date={contest.start_time}
              startTime={contest.start_time}
              endTime={contest.end_time}
              participants={contest.participant_count}
              calculatedTime={contest.calculated_time}
              type="previous"
            />
          ))}
        </div>
      </div>
    </div>
  );
}