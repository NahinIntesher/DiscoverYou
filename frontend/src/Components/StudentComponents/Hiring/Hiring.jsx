import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "react-material-symbols/rounded";
import HiringBox from "./HiringBox";
import { MaterialSymbol } from "react-material-symbols";
// import MyWebinars from "./MyHirings";
import { Link } from "react-router-dom";
import NotFound from "../../CommonComponents/NotFound";

export default function Hiring({ user }) {
  const [hiringsData, setHiringsData] = useState([]);
  const [hirings, setHirings] = useState([]);
  const [applyPendingNo, setApplyPendingNo] = useState([]);
  const [category, setCategory] = useState("myInterested");
  const [sort, setSort] = useState("name");
  const [searchText, setSearchText] = useState("");

  const allInterests = [
    "Competitive Programming",
    "Web/App Designing",
    "Gaming",
    "Photography",
    "Debating",
    "Singing",
    "Writing",
    "Art & Craft",
    "Graphics Designing",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/hirings")
      .then((response) => {
        const hiringsData = response.data.hirings;
        const applyPendingData = response.data.applyPending;
        setApplyPendingNo(applyPendingData);

        let filteredHiringsData = hiringsData.filter(hiring => user.interests.includes(hiring.job_category));
        filteredHiringsData.sort((a, b) => a.job_name.localeCompare(b.job_name));
        setHiringsData(hiringsData);
        setHirings(filteredHiringsData);
      })
      .catch((error) => {
        console.error("Error fetching hirings:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredHiringsData;
    let sortValue = name == "sort" ? value : sort;
    let categoryValue = name == "category" ? value : category;
    let searchTextValue = name == "search" ? value : searchText;

    if (categoryValue == "all") {
      setCategory("all");
      filteredHiringsData = hiringsData.filter(hiring => allInterests.includes(hiring.job_category));
    } else if (categoryValue == "myInterested") {
      filteredHiringsData = hiringsData.filter(hiring => user.interests.includes(hiring.job_category));
      setCategory("myInterested");
    } else {
      filteredHiringsData = hiringsData.filter(hiring => hiring.job_category == categoryValue);
      setCategory(categoryValue);
    }

    filteredHiringsData = filteredHiringsData.filter(hiring => hiring.job_name.toLowerCase().includes(searchTextValue.toLowerCase()));

    if (sortValue == "name") {
      setSort("name")
      filteredHiringsData.sort((a, b) => a.job_name.localeCompare(b.job_name));
    }
    else {
      setSort("job_salary")
      filteredHiringsData.sort((a, b) => b.job_salary - a.job_salary);
    }

    setHirings(filteredHiringsData);
  }

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Hirings</div>
        </div>
      </div>
      {applyPendingNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            You applied for {applyPendingNo} jobs are in pending.
          </div>
          <Link to={"/hiring/applications"} className="button">
            Pending Application
          </Link>
        </div>
      )}
      <div className="hiringBoxContainer">
        <div className="filterBox filterBoxCommunity">
          <div className="searchBox" >
            <MaterialSymbol className="icon" size={22} icon="search" />
            <input name="search" onChange={handleInputChange} placeholder="Search by name..." />
          </div>
          <div className="filters">
            <div className="filterName">Sort By</div>
            <div className="filter">
              <MaterialSymbol className="icon" size={22} icon="tune" />
              <select name="sort" onChange={handleInputChange}>
                <option value="name">Name</option>
                <option value="job_salary">Salary</option>
              </select>
            </div>
            <div className="filterName">Category</div>
            <div className="filter">
              <InterestIcon category={category} />
              <select name="category" onChange={handleInputChange}>
                <option
                  value="myInterested"
                >
                  My Interested
                </option>
                {allInterests.map((interest) => (
                  <option value={interest}>{interest}</option>
                ))}
                <option value="all">
                  All
                </option>
              </select>
            </div>
          </div>
        </div>
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
        : <NotFound message="No Job Offer Found"/>
      }
      </div>
    </div>
  );
}



function InterestIcon(data) {
    //   console.log();
    data = data.category;
    if (data == "Competitive Programming") {
        return <MaterialSymbol className="icon" size={22} icon="code" />;
    } else if (data == "Singing") {
        return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
    } else if (data == "Graphics Designing") {
        return <MaterialSymbol className="icon" size={22} icon="polyline" />;
    } else if (data == "Photography") {
        return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
    } else if (data == "Web/App Designing") {
        return <MaterialSymbol className="icon" size={22} icon="web" />;
    } else if (data == "Writing") {
        return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
    } else if (data == "Art & Craft") {
        return <MaterialSymbol className="icon" size={22} icon="draw" />;
    } else if (data == "Debating") {
        return <MaterialSymbol className="icon" size={22} icon="communication" />;
    } else if (data == "Gaming") {
        return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
    } else {
        return <MaterialSymbol className="icon" size={22} icon="interests" />;
    }
}