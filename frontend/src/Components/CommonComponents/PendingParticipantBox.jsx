import React from "react";
import dp from "../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";

export default function PendingParticipantBox({participantId, courseId, participantName,participantPicture, courseName, setUpdate}) {
  console.log(participantId, courseId, participantName, courseName);
    function approveMember() {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/course/member/approve", {
          participantId: participantId,
          courseId: courseId
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Aprroved Success!");
            setUpdate((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    function rejectMember() {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/course/member/reject", {
          participantId: participantId,
          courseId: courseId
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Aprroved Success!");
            setUpdate((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className="pendingMemberBox">
            <div className="profilePicture">
                <img src={participantPicture ? participantPicture : dp}/>
            </div>
            <div className="memberDetails">
                <div className="name">{participantName}</div>
                <div className="detail">Requested for joining <span className="community">{courseName}</span></div>
                <div className="viewProfile">View Profile</div>
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
    )
}