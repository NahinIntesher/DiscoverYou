import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/default.jpg";
import "../../../assets/styles/Profile.css";
import axios from "axios";

export default function Profile({ user }) {
  const [contestResults, setContestResults] = useState({});
  const [webinarResults, setWebinarResults] = useState({});
  const [hiringResults, setHiringResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/organizer/profile")
      .then((res) => {
        console.log(res.data);
        setContestResults(res.data.contestResults);
        setWebinarResults(res.data.webinarResults);
        setHiringResults(res.data.hiringResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="contributionSectionContainer px-4">
      <ContributionBox
        count={contestResults.total_contests}
        title="Contests Organized"
        icon="rewarded_ads"
        linkToRoute="contestResults"
      />
      <ContributionBox
        count={hiringResults.total_hirings}
        title="Hirings Organized"
        icon="gallery_thumbnail"
        linkToRoute="hiringResults"
      />
      <ContributionBox
        count={webinarResults.total_webinars}
        title="Webinars Organized"
        icon="patient_list"
        linkToRoute="webinarResults"
      />
    </div>
  );
}

function ContributionBox({ count, title, icon }) {
  return (
    <div className="overviewBox" style={{padding: "25px"}}>
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
    </div>
  );
}
