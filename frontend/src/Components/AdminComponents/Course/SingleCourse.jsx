import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import "../../../assets/styles/contest.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../assets/images/desert4.jpg";
import NotFound from "../../CommonComponents/NotFound";


const Singlecourse = () => {
  const { courseId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantNo, setParticipantNo] = useState(0);
  const [data, setData] = useState({
    course: null,
    participants: [],
    materials: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("materials");


  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3000/student/course/${courseId}`)
      .then((response) => {
        console.log("Course API Response:", response.data.course);
        setData(response.data);
        setLoading(false);
        const course = response.data.course;
        setIsRegistered(course.is_joined);
        setParticipantNo(course.participant_count);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [participantNo]);

  function notRegisteredError() {
    alert("Sorry, you didn't registered for this course!");
  }

  if (loading) return <p>Loading...</p>;
  
  return (
    <div className="mainContent">
      <Header
        title={data.course.course_name}
        semiTitle={`${data.course.course_category} Course`}
      />
      <div className="webinarHeader">
        <div className="leftSection">
          <div className="name">{data.course.course_name}</div>
          <Category category={data.course.course_category} />
        </div>
        <div className="rightSection">
        <div className="hostContainer">
            <div className="host">
              <div className="hostPicture">
                <img src={dp} />
              </div>
              <div className="hostDetails">
                <div className="detailTitle">Created By</div>
                <div className="detailInfo">{data.course.mentor_name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tabContainer">
        <div className={activeTab == "materials" ? "activeTab" : "tab"} onClick={function () { setActiveTab("materials") }}>Course Materials</div>
        <div className={activeTab == "course" ? "activeTab" : "tab"} onClick={function () { setActiveTab("course") }}>Course Details</div>
        <div className={activeTab == "participants" ? "activeTab" : "tab"} onClick={function () { setActiveTab("participants") }}>Course Participants</div>
      </div>

      {activeTab === "course" && (
        <div className="content center">
          <div className="detailsSection">
            <ProfileField
              icon="subject"
              label="Description"
              value={data.course.course_description}
            />
          </div>
        </div>
      )}
      {activeTab === "materials" && (
        <div className="content center">
            {data.materials.length > 0 ? (
              <div className="materialList">
                {data.materials.map((material) =>
                  <Material key={material.material_id} material={material} />
                )}
              </div>
            ) :
              <NotFound message={"This course have no material!"} />
            }
        </div>)
      }

      {activeTab === "participants" && (
        <div className="content center">
          {data.participants.length > 0 ? (
            <div className="participantList">
              {data.participants.map((participant) =>
                <Participant key={participant.participant_id} name={participant.participant_name} />
              )}
            </div>
          ) : (
            <NotFound message={"No participant found!"} />
          )}
        </div>
      )}
    </div>
  );
};

function Participant({ name }) {
  return (
    <div className="participant">
      <div className="profilePicture">
        <img src={dp} />
      </div>
      <div className="participantDetails">
        <div className="name">{name}</div>
        <div className="viewProfile">View Profile</div>
      </div>
    </div>
  );
}

function Material({material}) {
  const navigate = useNavigate();

  function goToMaterial() {
    axios.defaults.withCredentials = true;
    axios
    .post("http://localhost:3000/student/courses/material/complete/", {
        materialId: material.material_id
    })
    .then((res) => {
      if (res.data.status === "Success") {
        navigate("/course/material/"+material.material_id);
      } else {
        alert(res.data.Error);
      }
    })
    .catch((err) => console.log(err));
  };

  if (material.material_type.split("/")[0] == "image") {
    return (
      <div className="materialBox">
        <div className="media">
          <MaterialSymbol
            className="icon"
            size={42}
            icon="image"
          />
        </div>
        <div className="textContainer">
          <div className="name">{material.material_name}</div>
          <div className="format">Image</div>
        </div>
        <div className="buttonContainer">
          <div className="button" onClick={goToMaterial}>View Image</div>
          {material.is_completed ? 
            <div className="completed">Completed</div>
            : 
            <div className="incomplete">Not completed</div>
          }
        </div>
      </div>
    );
  } else if (material.material_type.split("/")[0] == "audio") {
    return (
      <div className="materialBox">
        <div className="media">
          <MaterialSymbol className="icon" size={42} icon="mic" />
        </div>
        <div className="textContainer">
          <div className="name">{material.material_name}</div>
          <div className="format">Audio</div>
        </div>
        <div className="buttonContainer">
          <div className="button" onClick={goToMaterial}>Listen Audio</div>
          {material.is_completed ? 
            <div className="completed">Completed</div>
            : 
            <div className="incomplete">Not completed</div>
          }
        </div>
      </div>
    );
  } else if (material.material_type.split("/")[0] == "video") {
    return (
      <div className="materialBox">
        <div className="media">
          <MaterialSymbol
            className="icon"
            size={42}
            icon="movie"
          />
        </div>
        <div className="textContainer">
          <div className="name">{material.material_name}</div>
          <div className="format">Video</div>
        </div>
        <div className="buttonContainer">
          <div className="button" onClick={goToMaterial}>Watch Video</div>
          {material.is_completed ? 
            <div className="completed">Completed</div>
            : 
            <div className="incomplete">Not completed</div>
          }
        </div>
      </div>
    );
  } else if (material.material_type.split("/")[0] == "application") {
    return (
      <div className="materialBox">
        <div className="media">
          <MaterialSymbol
            className="icon"
            size={42}
            icon="description"
          />
        </div>
        <div className="textContainer">
          <div className="name">{material.material_name}</div>
          <div className="format">PDF Document</div>
        </div>
        <div className="buttonContainer">
          <div className="button" onClick={goToMaterial}>Read Document</div>
          {material.is_completed ? 
            <div className="completed">Completed</div>
            : 
            <div className="incomplete">Not completed</div>
          }
        </div>
      </div>
    );
  }
}


function ProfileField({ icon, label, value }) {
  return (
    <div className="profileSectionField">
      <MaterialSymbol className="icon" size={28} icon={icon} />
      <div className="texts">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
}

function Category({ category }) {
  return (
    <div className="userInterest">
      {category === "Competitive Programming" && (
        <MaterialSymbol className="icon" size={24} icon="code" />
      )}
      {category === "Singing" && (
        <MaterialSymbol className="icon" size={24} icon="queue_music" />
      )}
      {category === "Graphics Designing" && (
        <MaterialSymbol className="icon" size={24} icon="polyline" />
      )}
      {category === "Photography" && (
        <MaterialSymbol className="icon" size={24} icon="photo_camera" />
      )}
      {category === "Web/App Designing" && (
        <MaterialSymbol className="icon" size={24} icon="web" />
      )}
      {category === "Writing" && (
        <MaterialSymbol className="icon" size={24} icon="edit_note" />
      )}
      {category === "Art & Craft" && (
        <MaterialSymbol className="icon" size={24} icon="draw" />
      )}
      {category === "Debating" && (
        <MaterialSymbol className="icon" size={24} icon="communication" />
      )}
      {category === "Gaming" && (
        <MaterialSymbol className="icon" size={24} icon="sports_esports" />
      )}
      <div className="text">{category}</div>
    </div>
  );
}

export default Singlecourse;