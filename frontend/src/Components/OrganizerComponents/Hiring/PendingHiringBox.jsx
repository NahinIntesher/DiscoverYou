import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PendingWebinarBox({
  hiringId,
  organizerId,
  organizerName,
  companyName,
  organizerPicture,
  jobName,
  jobCategory,
  jobDescription,
  jobSalery,
  endTime,
  applicantsCount,
  calculatedTime,
  setUpdate,
}) {
  const navigate = useNavigate();

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

  function editDetails() {
    navigate("/hiring/edit/" + hiringId);
  }

  function deleteHiring() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/organizer/hirings/delete", {
        hiringId: hiringId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Hiring "' + jobName + '" successfully deleted!');
          setUpdate((prevData) => prevData + 1);
          navigate("/hiring/pending");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  function approveMember() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/hirings/approve", {
        organizerId: organizerId,
        hiringId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Hiring "' + jobName + '" successfully approved!');
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
      .post("http://localhost:3000/admin/hirings/reject", {
        hiringId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Hiring "' + jobName + '" has been rejected.');
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
          <div className="detail">
            <table>
              <tr>
                <th>Organizer Name</th>
                <td>{organizerName}</td>
              </tr>
              <tr>
                <th>Company Name</th>
                <td>{companyName}</td>
              </tr>
              <tr>
                <th>Job Description</th>
                <td>{jobDescription}</td>
              </tr>
              <tr>
                <th>Job Salery</th>
                <td>{jobSalery}</td>
              </tr>
              <tr>
                <th>Last Date</th>
                <td>
                  {getDate(endTime)} ({getPMTime(endTime)})
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="buttonContainer">
        <div className="defaultButton" onClick={editDetails}>
          <MaterialSymbol className="icon" size={22} icon="edit" />
          <div className="text">Edit Details</div>
        </div>
        <div className="rejectButton" onClick={deleteHiring}>
          <MaterialSymbol className="icon" size={22} icon="delete" />
          <div className="text">Delete</div>
        </div>
      </div>
    </div>
  );
}
