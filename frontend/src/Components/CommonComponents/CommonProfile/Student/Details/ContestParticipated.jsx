import React, { useState, useEffect } from "react";
import axios from "axios";
import ContestBox from "./ContestBox";
import NotFound from "../../../../CommonComponents/NotFound";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function CommonContestParticipated({}) {
  const { paramId } = useParams();
  console.log("ParaasdfasmId:", paramId);
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
  console.log("User:", user);

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
      <Header title={`Contest participated`} semiTitle={`by ${user.name}`} />
      <div className="tabContent">
        <div className="cousreSemiTitle">Participated Contests</div>
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
                totalMember={contest.participant_count}
                rank={contest.rank}
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
