import React, { useState, useEffect } from "react";
import axios from "axios";
import WebinarBox from "./WebinarBox";
import NotFound from "../../../../CommonComponents/NotFound";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function CommonWebinarHosted({}) {
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
  console.log("User:", user);

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
      <Header title={`Webinar hosted by ${user.name}`} />
      <div className="tabContent">
        {webinarResults.length > 0 ? (
          webinarResults.map(function (webinar) {
            return (
              <WebinarBox
                key={webinar.webinar_id}
                id={webinar.webinar_id}
                name={webinar.webinar_name}
                category={webinar.webinar_category}
                description={webinar.webinar_description}
                hostPicture={webinar.host_picture}
                hostName={webinar.host_name}
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
