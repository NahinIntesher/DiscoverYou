import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function PendingCourseBox({
  id,
  name,
  category,
  description,
  mentorName,
  mentorPicture,
  mentorId,
  setUpdate,
}) {
  const navigate = useNavigate();
  function seeDetails() {
    navigate("/course/" + id);
  }
  function approveMember() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/course/approve", {
        mentorId: mentorId,
        courseId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/student/notifications", {
              recipientId: mentorId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Course Creation",
              notificationMessage: `Admin have approved your created course!`,
              notificationLink: `/course/pending`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Course "' + name + '" successfully approved!');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  function rejectMember() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/course/reject", {
        courseId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/student/notifications", {
              recipientId: mentorId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Course Rejection",
              notificationMessage: `Admin have rejected your pending created course!`,
              notificationLink: `/course/pending`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Course "' + name + '" has been rejected.');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="pendingCommunityBox">
      <div className="communityDetails">
        <div className="informationContainer">
          <div className="information">
            <div className="title">{name}</div>
            <div className="category">
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
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="photo_camera"
                />
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
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="communication"
                />
              )}
              {category === "Gaming" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="sports_esports"
                />
              )}
              <div className="text">{category}</div>
            </div>
          </div>
        </div>
        <div className="description">
          <div className="organizer">
            <div className="organizerPicture">
              <img src={mentorPicture ? mentorPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Requested By</div>
              <div className="detailInfo">{mentorName}</div>
            </div>
          </div>
          <div className="detail">{description}</div>
        </div>
      </div>
      <div className="buttonContainer">
        {/* <Link to={"/course/"+id} className="acceptButton joinButton">See Details</Link> */}
        <div className="acceptButton" onClick={seeDetails}>
          <MaterialSymbol className="icon" size={22} icon="info" />
          <div className="text">See Details</div>
        </div>
        <div className="acceptButton" onClick={approveMember}>
          <MaterialSymbol className="icon" size={22} icon="check" />
          <div className="text">Approve</div>
        </div>
        <div className="rejectButton" onClick={rejectMember}>
          <MaterialSymbol className="icon" size={22} icon="close" />
          <div className="text">Reject</div>
        </div>
      </div>
    </div>
  );
}
