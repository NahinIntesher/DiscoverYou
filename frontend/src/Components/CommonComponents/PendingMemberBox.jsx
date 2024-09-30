import React from "react";
import dp from "../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingMemberBox({memberId, communityId, memberName, memberPicture, communityName, setUpdate}) {
    function approveMember() {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/community/member/approve", {
            memberId: memberId,
            communityId: communityId
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
        .post("http://localhost:3000/student/community/member/reject", {
            memberId: memberId,
            communityId: communityId
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
                <img src={memberPicture ? memberPicture : dp}/>
            </div>
            <div className="memberDetails">
                <div className="name">{memberName}</div>
                <div className="detail">Requested for joining <Link to={"/community/"+communityId} className="community">{communityName}</Link></div>
                <Link to={"/profile/"+memberId} className="viewProfile">View Profile</Link>
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