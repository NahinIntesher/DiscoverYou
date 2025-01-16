import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import WebinarBox from "../../CommonComponents/WebinarBox";
import 'react-material-symbols/rounded';

export default function UpcomingWebinar() {
  const [webinars, setWebinars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/webinars/upcoming")
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
            hostPicture={webinar.host_picture}
            hostId={webinar.host_id}
            details={webinar.webinar_details}
            category={webinar.webinar_category}
            host={webinar.host_name}
            date={webinar.start_time}
            startTime={webinar.start_time}
            endTime={webinar.end_time}
            participants={webinar.participant_count}
            meetingLink={webinar.meeting_link}
            calculatedTime={webinar.calculated_time}
            description={webinar.webinar_description}
            type="upcoming"
          />
        ))}
      </div>
    )
  }
  else {
      return <NotFound message="There are currently no Ongoing Webinar!" />
  }
}
