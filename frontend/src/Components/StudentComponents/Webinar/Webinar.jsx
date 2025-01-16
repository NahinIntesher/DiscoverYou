import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function Webinar({ user }) {
  const [webinarsData, setWebinarsData] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [myWebinars, setMyWebinars] = useState([]);
  const [ongoingWebinars, setOngoingWebinars] = useState([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [previousWebinars, setPreviousWebinars] = useState([]);
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
      .get("http://localhost:3000/organizer/webinars")
      .then((res) => {
        console.log("Success");
        const webinarsData = res.data?.webinars || [];

        let filteredwebinarsData = webinarsData.filter((webinar) =>
          user.interests.includes(webinar.webinar_category)
        );
        filteredwebinarsData.sort((a, b) =>
          a.webinar_name.localeCompare(b.webinar_name)
        );
        setWebinarsData(webinarsData);
        setWebinars(filteredwebinarsData);
        setEachwebinar(filteredwebinarsData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  const setEachwebinar = (filteredwebinarsData) => {
    let now = new Date();
    setOngoingWebinars(
      filteredwebinarsData.filter(
        (webinar) =>
          new Date(webinar.start_time) <= now &&
          new Date(webinar.end_time) >= now
      )
    );
    setUpcomingWebinars(
      filteredwebinarsData.filter(
        (webinar) => new Date(webinar.start_time) > now
      )
    );
    setPreviousWebinars(
      filteredwebinarsData.filter((webinar) => new Date(webinar.end_time) < now)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredwebinarsData;
    let filteredmywebinarsData;
    let sortValue = name == "sort" ? value : sort;
    let categoryValue = name == "category" ? value : category;
    let searchTextValue = name == "search" ? value : searchText;

    if (categoryValue == "all") {
      setCategory("all");
      filteredwebinarsData = webinarsData.filter((webinar) =>
        allInterests.includes(webinar.webinar_category)
      );
    } else if (categoryValue == "myInterested") {
      filteredcontestsData = webinarsData.filter((webinar) =>
        user.interests.includes(webinar.webinar_category)
      );
      setCategory("myInterested");
    } else {
      filteredwebinarsData = webinarsData.filter(
        (webinar) => webinar.webinar_category == categoryValue
      );
      setCategory(categoryValue);
    }

    filteredwebinarsData = filteredwebinarsData.filter((webinar) =>
      webinar.webinar_name.toLowerCase().includes(searchTextValue.toLowerCase())
    );

    if (sortValue == "name") {
      setSort("name");
      filteredwebinarsData.sort((a, b) =>
        a.webinar_name.localeCompare(b.webinar_name)
      );
      filteredmywebinarsData.sort((a, b) =>
        a.webinar_name.localeCompare(b.webinar_name)
      );
    } else {
      setSort("register");
      filteredwebinarsData.sort(
        (a, b) => b.participant_count - a.participant_count
      );
      filteredmywebinarsData.sort(
        (a, b) => b.participant_count - a.participant_count
      );
    }

    setWebinars(filteredwebinarsData);
    setEachwebinar(filteredwebinarsData);
  };

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinar</div>
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
        <h3 className="contentSemiTitle">Ongoing Webinars</h3>
        <OngoingWebinar webinars={ongoingWebinars} />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Upcoming Webinars</h3>
        <UpcomingWebinar webinars={upcomingWebinars} />
        <div className="miniBreak"></div>

        <h3 className="contentSemiTitle">Previous Webinars</h3>
        <PreviousWebinar webinars={previousWebinars} />
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
