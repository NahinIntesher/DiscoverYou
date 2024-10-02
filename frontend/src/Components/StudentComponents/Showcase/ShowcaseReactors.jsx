import { React, useEffect } from "react";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import dp from "../../../assets/images/default.jpg";

export default function ShowcaseReactors() {
  const { postId } = useParams(); // extract postId
  const [reactors, setReactors] = useState([]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/student/showcase/reactor", {
        params: {
          postId: postId, // passing postId properly
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          const reactors = res.data.reactors;
          console.log(reactors);
          setReactors(reactors);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [postId]);

  return (
    <div className="mainContent">
      <Header title={"Post Reactors"} />
      <div className="contentContainer">
        <div className="reactorsContainer">
          {reactors.map((reactor) => (
            <Reactors
              key={reactor.reactor_id}
              name={reactor.reactor_name}
              reactorPicture={reactor.reactor_picture}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function Reactors({ name, reactorPicture }) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={reactorPicture ? reactorPicture : dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        <div className="viewProfile">View Profile</div>
      </div>
    </div>
  );
}