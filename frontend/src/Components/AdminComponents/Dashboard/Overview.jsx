import React from "react";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Overview() {
  const [studentResults, setStudentResults] = useState({});
  const [organizerResults, setOrganizerResults] = useState({});
  const [adminResults, setAdminResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/admin/dashboard/overview")
      .then((res) => {
        console.log(res.data);
        setStudentResults(res.data.studentResults);
        setOrganizerResults(res.data.organizerResults);
        setAdminResults(res.data.adminResults);
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
    <div className="contributionSectionContainer">
      <ContributionBox
        title="Students"
        count={studentResults.total_students}
        icon="person"
      />
      <ContributionBox
        title="Organizers"
        count={organizerResults.total_organizers}
        icon="groups"
      />
      <ContributionBox
        title="Admins"
        count={adminResults.total_admins}
        icon="co_present"
      />
    </div>
  );
}

function ContributionBox({ count, title, icon }) {
  return (
    <div className="overviewBox">
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
    </div>
  );
}
