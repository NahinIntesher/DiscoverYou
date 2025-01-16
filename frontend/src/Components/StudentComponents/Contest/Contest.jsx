import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import ContestBox from "./ContestBox";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import OngoingContest from "./OngoingContest";
import UpcomingContest from "./UpcomingContest";
import PreviousContest from "./PreviousContest";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function Contest({ user }) {
  const [contestsData, setContestsData] = useState([]);
  const [contests, setContests] = useState([]);
  const [ongoingContests, setOngoingContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [previousContests, setPreviousContests] = useState([]);
  const [category, setCategory] = useState("myInterested");
  const [sort, setSort] = useState("name");
  const [searchText, setSearchText] = useState("");

  // console.log(user.interests)

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
      .get("http://localhost:3000/student/contests")
      .then((res) => {
        console.log("Success");
        const contestsData = res.data?.contests || [];

        let filteredcontestsData = contestsData.filter((contest) =>
          user.interests.includes(contest.contest_category)
        );
        filteredcontestsData.sort((a, b) =>
          a.contest_name.localeCompare(b.contest_name)
        );
        setContestsData(contestsData);
        setContests(filteredcontestsData);
        setEachContest(filteredcontestsData);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

  const setEachContest = (filteredcontestsData) => {
    let now = new Date();
    setOngoingContests(
      filteredcontestsData.filter(
        (contest) =>
          new Date(contest.start_time) <= now &&
          new Date(contest.end_time) >= now
      )
    );
    setUpcomingContests(
      filteredcontestsData.filter(
        (contest) => new Date(contest.start_time) > now
      )
    );
    setPreviousContests(
      filteredcontestsData.filter((contest) => new Date(contest.end_time) < now)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredcontestsData;
    let sortValue = name == "sort" ? value : sort;
    let categoryValue = name == "category" ? value : category;
    let searchTextValue = name == "search" ? value : searchText;

    if (categoryValue == "all") {
      setCategory("all");
      filteredcontestsData = contestsData.filter((contest) =>
        allInterests.includes(contest.contest_category)
      );
    } else if (categoryValue == "myInterested") {
      filteredcontestsData = contestsData.filter((contest) =>
        user.interests.includes(contest.contest_category)
      );
      setCategory("myInterested");
    } else {
      filteredcontestsData = contestsData.filter(
        (contest) => contest.contest_category == categoryValue
      );
      setCategory(categoryValue);
    }

    filteredcontestsData = filteredcontestsData.filter((contest) =>
      contest.contest_name.toLowerCase().includes(searchTextValue.toLowerCase())
    );

    if (sortValue == "name") {
      setSort("name");
      filteredcontestsData.sort((a, b) =>
        a.contest_name.localeCompare(b.contest_name)
      );
    } else {
      setSort("register");
      filteredcontestsData.sort(
        (a, b) => b.participant_count - a.participant_count
      );
    }

    setContests(filteredcontestsData);
    setEachContest(filteredcontestsData);
  };

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Contest</div>
        </div>
      </div>
      <div className="content">
        <div className="filterBox filterBoxCommunity">
          <div className="searchBox">
            <MaterialSymbol className="icon" size={22} icon="search" />
            <input
              name="search"
              onChange={handleInputChange}
              placeholder="Search by name..."
            />
          </div>
          <div className="filters">
            <div className="filterName">Sort By</div>
            <div className="filter">
              <MaterialSymbol className="icon" size={22} icon="tune" />
              <select name="sort" onChange={handleInputChange}>
                <option value="name">Name</option>
                <option value="register">Registers</option>
              </select>
            </div>
            <div className="filterName">Category</div>
            <div className="filter">
              <InterestIcon category={category} />
              <select name="category" onChange={handleInputChange}>
                <option value="myInterested">My Interested</option>
                {allInterests.map((interest) => (
                  <option value={interest}>{interest}</option>
                ))}
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>
        <h3 className="contentSemiTitle">Ongoing Contests</h3>
        <OngoingContest contests={ongoingContests} />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Contests</h3>
        <UpcomingContest contests={upcomingContests} />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Contests</h3>
        <PreviousContest contests={previousContests} />
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
