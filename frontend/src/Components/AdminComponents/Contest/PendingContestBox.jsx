import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingContestBox({
  id,
  name,
  category,
  description,
  hostName,
  hostPicture,
  hostId,
  setUpdate,
  meetingLink,
  startTime,
  endTime,
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

  function approveMember() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/contests/approve", {
        contestId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/organizer/notifications", {
              recipientId: hostId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Contest Acceptancce",
              notificationMessage: `Admin have approved your pending contest!`,
              notificationLink: `/contest/`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Contest "' + name + '" successfully approved!');
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
      .post("http://localhost:3000/admin/contests/reject", {
        contestId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/organizer/notifications", {
              recipientId: hostId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "Contest Rejection",
              notificationMessage: `Admin have rejected your pending contest!`,
              notificationLink: `/contest/`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Successfully notification send");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));
          alert('Contest "' + name + '" has been rejected.');
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
          <Link to={"/profile/" + hostId} className="organizer">
            <div className="organizerPicture">
              <img src={hostPicture ? hostPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Requested By</div>
              <div className="detailInfo">{hostName}</div>
            </div>
          </Link>
          <div className="detail">
            <table>
              <tr>
                <th>Description</th>
                <td>{description}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{getDate(startTime)}</td>
              </tr>
              <tr>
                <th>Time</th>
                <td>
                  {getPMTime(startTime)} - {getPMTime(endTime)}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="buttonContainer">
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
