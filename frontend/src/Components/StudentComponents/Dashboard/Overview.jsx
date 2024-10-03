import React from "react";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Overview() {
  const [contestResults, setContestResults] = useState({});
  const [showcaseResults, setShowcaseResults] = useState({});
  const [courseResults, setCourseResults] = useState({});
  const [webinarResults, setWebinarResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/student/profile")
      .then((res) => {
        console.log(res.data);
        setContestResults(res.data.contestResults);
        setShowcaseResults(res.data.showcaseResults);
        setCourseResults(res.data.courseResults);
        setWebinarResults(res.data.webinarResults);
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
        count={contestResults.total_contests}
        title="Contests Participation"
        icon="rewarded_ads"
        secondaryCount={contestResults.rank_1_count}
        tertiaryCount={contestResults.rank_2_count}
        secondaryTitle="Winner"
        tertiaryTitle="Runner-up"
        linkToRoute="contestResults"
      />
      <ContributionBox
        count={courseResults.course_count}
        title="Courses Enrolled"
        icon="auto_stories"
        secondaryCount={1}
        secondaryTitle="Completed"
        linkToRoute="courseResults"
      />
      <ContributionBox
        count={showcaseResults.total_posts}
        title="Showcase Posts"
        icon="gallery_thumbnail"
        secondaryCount={showcaseResults.total_reactions}
        secondaryTitle="Reactions"
        linkToRoute="showcaseResults"
      />
      <ContributionBox
        count={webinarResults.webinar_count}
        title="Webinars Attended"
        icon="patient_list"
        // secondaryCount={showcaseResults.total_reactions}
        secondaryTitle="No talks"
        linkToRoute="webinarResults"
      />
    </div>
  );
}

function ContributionBox({
  count,
  title,
  secondaryCount,
  tertiaryCount,
  secondaryTitle,
  tertiaryTitle,
  icon,
  linkToRoute,
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    alert("clicked");
    // navigate(`/${linkToRoute}`)
  };
  return (
    <div className="overviewBox">
      <MaterialSymbol className="icon" size={50} icon={icon} />
      <MaterialSymbol className="floatedIcon" size={180} icon={icon} />
      <div className="texts">
        <div className="count">{count}</div>
        <div className="title">{title}</div>
      </div>
      <div className="secondDetail">
        <div className="spanContainer">
          <span className="count">{secondaryCount}</span>
          <span className="title">{secondaryTitle}</span>
        </div>

        <div className="spanContainer">
          <span className="count">{tertiaryCount}</span>
          <span className="title">{tertiaryTitle}</span>
        </div>
      </div>
    </div>
  );
}
