import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import WebinarBox from "../../CommonComponents/WebinarBox";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function Webinar() {
  const navigate = useNavigate();
  const [previousWebinars, setPreviousWebinars] = useState([]);
  const [ongoingWebinars, setOngoingWebinars] = useState([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/webinars")
      .then((response) => {
        const webinars = response.data.webinars;
        const now = new Date();

        const previous = webinars.filter(
          (webinar) => new Date(webinar.end_time) < now
        );
        const ongoing = webinars.filter(
          (webinar) =>
            new Date(webinar.start_time) <= now &&
            new Date(webinar.end_time) >= now
        );
        const upcoming = webinars.filter(
          (webinar) => new Date(webinar.start_time) > now
        );

        setPreviousWebinars(previous);
        setOngoingWebinars(ongoing);
        setUpcomingWebinars(upcoming);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinar</div>
          <div className="buttonContainer">
            <Link to="/community/new" className="button">
                <MaterialSymbol className="icon" size={24} icon="add" />
                <div className="text">Create New Webinar</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="content">
      <h3 className="contentSemiTitle">Ongoing Webinars</h3>
        {ongoingWebinars.length ? (
          <div className="scrollContainer">
            {ongoingWebinars.map((webinar) => (
              <WebinarBox
                key={webinar.webinar_id}
                id={webinar.webinar_id}
                name={webinar.webinar_name}
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
                isJoined={webinar.is_joined}
                type="ongoing"
              />
            ))}
          </div>
        ) : (
          <NotFound message="There are currently no Ongoing Webinar!" />
        )}

        <div className="miniBreak"></div>
        <h3 className="contentSemiTitle">Upcoming Webinars</h3>
          {upcomingWebinars.length ? (
            <div className="scrollContainer">
              {upcomingWebinars.map((webinar) => (
                <WebinarBox
                  key={webinar.webinar_id}
                  id={webinar.webinar_id}
                  name={webinar.webinar_name}
                  details={webinar.webinar_details}
                  category={webinar.webinar_category}
                  host={webinar.host_name}
                  date={webinar.start_time}
                  startTime={webinar.start_time}
                  endTime={webinar.end_time}
                  participants={webinar.participant_count}
                  calculatedTime={webinar.calculated_time}
                  description={webinar.webinar_description}
                  isJoined={webinar.is_joined}
                  type="upcoming"
                />
              ))}
            </div>
          ) : (
            <NotFound message="There are currently no Upcoming Webinar!" />
          )}

        <div className="miniBreak"></div>
        <h3 className="contentSemiTitle">Previous Webinars</h3>
        {previousWebinars.length ? (
            <div className="scrollContainer">
              {previousWebinars.map((webinar) => (
                <WebinarBox
                  key={webinar.webinar_id}
                  id={webinar.webinar_id}
                  name={webinar.webinar_name}
                  details={webinar.webinar_details}
                  category={webinar.webinar_category}
                  host={webinar.host_name}
                  date={webinar.start_time}
                  startTime={webinar.start_time}
                  endTime={webinar.end_time}
                  participants={webinar.participant_count}
                  calculatedTime={webinar.calculated_time}
                  recordedLink={webinar.recorded_link}
                  description={webinar.webinar_description}
                  isJoined={webinar.is_joined}
                  type="previous"
                />
              ))}
            </div>
          ) : (
            <NotFound message="There are currently no Previous Webinar!" />
          )}
      </div>
    </div>
  );
}
