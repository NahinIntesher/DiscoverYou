import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import OngoingWebinar from "./OngoingWebinar";
import UpcomingWebinar from "./UpcomingWebinar";
import PreviousWebinar from "./PreviousWebinar";
import MyWebinar from "./MyWebinar";

export default function Webinar({ user }) {
  const [pendingWebinarsNo, setPendingWebinarsNo] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/webinars/pending-details")
      .then((res) => {
        console.log("Success");
        const pendingWebinarNo = res.data?.pendingWebinarNo || [];

        setPendingWebinarsNo(pendingWebinarNo);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  const [webinarsData, setWebinarsData] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [myWebinarsData, setMyWebinarsData] = useState([]);
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
      .get("http://localhost:3000/organizer/webinars/myCreated")
      .then((response) => {
        const webinarsData = response.data.webinars;

        let filteredwebinarsData = webinarsData.filter((webinar) =>
          allInterests.includes(webinar.webinar_category)
        );
        filteredwebinarsData.sort((a, b) =>
          a.webinar_name.localeCompare(b.webinar_name)
        );
        setMyWebinarsData(webinarsData);
        setMyWebinars(filteredwebinarsData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/webinars")
      .then((res) => {
        console.log("Success");
        const webinarsData = res.data?.webinars || [];

        let filteredwebinarsData = webinarsData.filter((webinar) =>
          allInterests.includes(webinar.webinar_category)
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

    console.log(webinarsData);
    console.log(myWebinars);
    if (categoryValue == "all") {
      setCategory("all");
      filteredwebinarsData = webinarsData.filter((webinar) =>
        allInterests.includes(webinar.webinar_category)
      );
      filteredmywebinarsData = myWebinarsData.filter((webinar) =>
        allInterests.includes(webinar.webinar_category)
      );
    } else {
      filteredwebinarsData = webinarsData.filter(
        (webinar) => webinar.webinar_category == categoryValue
      );
      filteredmywebinarsData = myWebinarsData.filter(
        (webinar) => webinar.webinar_category == categoryValue
      );
      setCategory(categoryValue);
    }

    filteredwebinarsData = filteredwebinarsData.filter((webinar) =>
      webinar.webinar_name.toLowerCase().includes(searchTextValue.toLowerCase())
    );
    filteredmywebinarsData = filteredmywebinarsData.filter((webinar) =>
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
    setMyWebinars(filteredmywebinarsData);
    setEachwebinar(filteredwebinarsData);
  };

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinar</div>
          <div className="buttonContainer">
            <Link to="/webinar/new" className="button">
              <MaterialSymbol className="icon" size={24} icon="add" />
              <div className="text">Create New Webinar</div>
            </Link>
          </div>
        </div>
      </div>
      {pendingWebinarsNo != 0 && (
        <div className="pendingBox">
          <MaterialSymbol className="icon" size={32} icon="error" />
          <div className="text">
            Your {pendingWebinarsNo} webinars approval are in pending.
          </div>
          <Link to={"/webinar/pending"} className="button">
            Pending Webinars
          </Link>
        </div>
      )}
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
                <option value="all">All</option>
                {allInterests.map((interest) => (
                  <option value={interest}>{interest}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <h3 className="contentSemiTitle">My Webinars</h3>
        <MyWebinar webinars={myWebinars} />
        <div className="miniBreak"></div>

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
