import React from "react";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingApplicationBox({
  id, 
  jobName, 
  companyName, 
  category, 
  description, 
  organizerName, 
  organizerId, 
  organizerPicture,
  salary,
  lastDate,
  setUpdate
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

  function cancelApply() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/hirings/cancel-apply", {
        hiringId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Your application for "' + companyName + '" has been canceled!.');
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
          <Link to={"/profile/"+organizerId} className="organizer">
            <div className="organizerPicture">
              <img src={organizerPicture ? organizerPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Organized By</div>
              <div className="detailInfo">{organizerName}</div>
            </div>
          </Link>
          <div className="detail">
            <table>
              <tr><th>Salary</th><td>{salary}৳</td></tr>
              <tr><th>Description</th><td>{description}</td></tr>
              <tr><th>Last Date</th><td>{getDate(lastDate)+" ("+getPMTime(lastDate)+")"}</td></tr>
              
              {/* <tr><th>Date</th><td>{getDate(startTime)}</td></tr>
              <tr><th>Time</th><td>{getPMTime(startTime)} - {getPMTime(endTime)}</td></tr>
              <tr><th>Meeting Link</th><td>{meetingLink}</td></tr> */}
            </table>
          </div>
        </div>
      </div>
      <div className="buttonContainer">
        <div className="rejectButton" onClick={cancelApply}>
          <div className="text">Cancel Apply</div>
        </div>
      </div>
    </div>
  );
}
