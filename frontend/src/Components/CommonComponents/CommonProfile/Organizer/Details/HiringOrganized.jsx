import React, { useState, useEffect } from "react";
import axios from "axios";
import HiringBox from "./HiringBox";
import NotFound from "../../../../CommonComponents/NotFound";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function CommonHiringOrganized({}) {
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

  const [hiringResults, setHiringResults] = useState({});
  console.log(hiringResults);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/dynamic-profile/${paramId}`)
      .then((res) => {
        console.log(res.data);
        setHiringResults(res.data.hiringResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

  return (
    <div className="mainContent">
      <Header title={`Hirings organized by ${user.name}`} />
      <div className="tabContent">
        {hiringResults.length > 0 ? (
          hiringResults.map(function (hiring) {
            return (
              <HiringBox
                key={hiring.hiring_id}
                hiringId={hiring.hiring_id}
                organizerName={hiring.organizer_name}
                organizerPicture={hiring.organizer_picture}
                companyName={hiring.company_name}
                jobName={hiring.job_name}
                jobCategory={hiring.job_category}
                jobDescription={hiring.job_description}
              />
            );
          })
        ) : (
          <NotFound message="No hiring Found" />
        )}
      </div>
    </div>
  );
}
