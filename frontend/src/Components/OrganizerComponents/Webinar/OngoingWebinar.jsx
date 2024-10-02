import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import WebinarBox from "../../CommonComponents/WebinarBox";
import 'react-material-symbols/rounded';

export default function OngoingWebinar() {
  const [webinars, setWebinars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/webinars/ongoing")
      .then((response) => {
        const webinarsData = response.data.webinars;
        setWebinars(webinarsData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  if (webinars.length) {
    return (
      <div className="scrollContainer">
        {webinars.map((webinar) => (
          <WebinarBox
            key={webinar.webinar_id}
            id={webinar.webinar_id}
            name={webinar.webinar_name}
            details={webinar.webinar_details}
            category={webinar.webinar_category}
            host={webinar.host_name}
            hostPicture={webinar.host_picture}
            startTime={webinar.start_time}
            endTime={webinar.end_time}
            participants={webinar.participant_count}
            meetingLink={webinar.meeting_link}
            calculatedTime={webinar.calculated_time}
            description={webinar.webinar_description}
            type="ongoing"
          />
        ))}
      </div>
    )
  }
  else {
      return <NotFound message="There are currently no Ongoing Webinar!" />
  }
}
