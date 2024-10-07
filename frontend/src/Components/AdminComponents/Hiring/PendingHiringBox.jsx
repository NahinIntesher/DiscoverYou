import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingHiringBox({
  hiringId,
  companyName,
  jobName,
  jobCategory,
  jobDescription,
  organizerName,
  organizerPicture,
  organizerId,
  jobSalery,
  setUpdate,
  lastDate,
  
}) {
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

  function approve() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/hiring/approve", {
        organizerId: organizerId,
        hiringId: hiringId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/organizer/notifications", {
              recipientId: organizerId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Hiring Approval",
              notificationMessage: `Admin have accepted your pending created hiring!`,
              notificationLink: `/hiring/pending`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Hiring for "' + jobName + '" job successfully approved!');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  function reject() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/hiring/reject", {
        hiringId: hiringId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/organizer/notifications", {
              recipientId: organizerId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Hiring Rejection",
              notificationMessage: `Admin have rejected your pending created hiring!`,
              notificationLink: `/hiring/pending`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Hiring for "' + jobName + '" job has been rejected.');
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
          <div className="title">{jobName}</div>
          <div className="semiTitle">{companyName}</div>
            <div className="category">
              {jobCategory === "Competitive Programming" && (
                <MaterialSymbol className="icon" size={24} icon="code" />
              )}
              {jobCategory === "Singing" && (
                <MaterialSymbol className="icon" size={24} icon="queue_music" />
              )}
              {jobCategory === "Graphics Designing" && (
                <MaterialSymbol className="icon" size={24} icon="polyline" />
              )}
              {jobCategory === "Photography" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="photo_camera"
                />
              )}
              {jobCategory === "Web/App Designing" && (
                <MaterialSymbol className="icon" size={24} icon="web" />
              )}
              {jobCategory === "Writing" && (
                <MaterialSymbol className="icon" size={24} icon="edit_note" />
              )}
              {jobCategory === "Art & Craft" && (
                <MaterialSymbol className="icon" size={24} icon="draw" />
              )}
              {jobCategory === "Debating" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="communication"
                />
              )}
              {jobCategory === "Gaming" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="sports_esports"
                />
              )}
              <div className="text">{jobCategory}</div>
            </div>
          </div>
        </div>
        <div className="description">
          <Link to={"/profile/" + organizerId} className="organizer">
            <div className="organizerPicture">
              <img src={organizerPicture ? organizerPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Requested By</div>
              <div className="detailInfo">{organizerName}</div>
            </div>
          </Link>
          <div className="detail">
            <table>
              <tr><th>Salary</th><td>{jobSalery}৳</td></tr>
              <tr><th>Description</th><td>{jobDescription}</td></tr>
              <tr><th>Last Date</th><td>{getDate(lastDate)+" ("+getPMTime(lastDate)+")"}</td></tr>
            </table>
          </div>
        </div>
      </div>
      <div className="buttonContainer">
        <div className="acceptButton" onClick={approve}>
          <MaterialSymbol className="icon" size={22} icon="check" />
          <div className="text">Approve</div>
        </div>
        <div className="rejectButton" onClick={reject}>
          <MaterialSymbol className="icon" size={22} icon="close" />
          <div className="text">Reject</div>
        </div>
      </div>
    </div>
  );
}
