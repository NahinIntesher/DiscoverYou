import React, { useState, useEffect } from "react";
import axios from "axios";
import ContestBox from "./ContestBox";
import NotFound from "../../../../CommonComponents/NotFound";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function CommonContestOrganized({}) {
  const { paramId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (paramId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${paramId}`)
        .then((res) => {
          console.log(res.data);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [paramId]);

  const [contestResults, setContestResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/dynamic-profile/${paramId}`)
      .then((res) => {
        console.log(res.data);
        setContestResults(res.data.contestResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

  return (
    <div className="mainContent">
      <Header title={paramId.startsWith("St") ? `Contest Participated` : "Contest Organized"} semiTitle={ `By ${user.name}`} />
      <div className="tabContent">
        {contestResults.length > 0 ? (
          contestResults.map(function (contest) {
            return (
              <ContestBox
                key={contest.contest_id}
                id={contest.contest_id}
                name={contest.contest_name}
                category={contest.contest_category}
                details={contest.contest_details}
                organizerName={contest.organizer_name}
                organizerPicture={contest.organizer_picture}
                totalContests={contest.total_contests}
              />
            );
          })
        ) : (
          <NotFound message="No contest Found" />
        )}
      </div>
    </div>
  );
}
