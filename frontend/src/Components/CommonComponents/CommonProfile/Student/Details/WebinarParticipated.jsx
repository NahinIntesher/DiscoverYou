import React, { useState, useEffect } from "react";
import axios from "axios";
import WebinarBox from "./WebinarBox";
import NotFound from "../../../../CommonComponents/NotFound";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";
export default function CommonWebinarParticipated({}) {
  const { paramId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (paramId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${paramId}`)
        .then((res) => {
          console.log(res.data);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [paramId]);
  const [webinarResults, setWebinarResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/dynamic-profile/${paramId}`)
      .then((res) => {
        console.log(res.data);
        setWebinarResults(res.data.webinarResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

  return (
    <div className="mainContent">
      <Header title={paramId.startsWith("St") ? `Webinar Participated` : "Webinar Hosted"} semiTitle={`By ${user.name}`} />
      <div className="tabContent">
        <div className="cousreSemiTitle">Participated Webinars</div>
        {webinarResults.length > 0 ? (
          webinarResults.map(function (webinar) {
            return (
              <WebinarBox
                key={webinar.webinar_id}
                id={webinar.webinar_id}
                name={webinar.webinar_name}
                hostPicture={webinar.host_picture}
                category={webinar.webinar_category}
                description={webinar.webinar_description}
                hostName={webinar.host_name}
                totalMember={webinar.participant_count}
              />
            );
          })
        ) : (
          <NotFound message="No webinar Found" />
        )}
      </div>
    </div>
  );
}
