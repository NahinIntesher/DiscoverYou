import React from "react";
import dp from "../../assets/images/default.jpg"
import { Link } from "react-router-dom";

export default function CommentBox({commentatorId, commentatorPicture, commentContent, commentatorName, commentTimeAgo}) {
    function calculatePostAgoTime(timeDifference){
        if(timeDifference<60){
            return "Few sec ago";
        } else if((timeDifference/60)<60) {
            return Math.floor(timeDifference/60)+" min ago";
        } else if((timeDifference/(60*60))<24) {
            return Math.floor(timeDifference/(60*60))+" hour ago";
        } else {
            return Math.floor(timeDifference/(60*60*24))+" day ago";
        }
    }

    return (
        <div className="commentBox">
            <Link to={"/profile/"+commentatorId} className="profilePicture">
                <img src={commentatorPicture ? commentatorPicture : dp}/>
            </Link>
            <div className="commentContentBox">
                <Link to={"/profile/"+commentatorId} className="name">{commentatorName}</Link>
                <div className="text">{commentContent}</div>
                <div className="details">{calculatePostAgoTime(commentTimeAgo)}</div>
            </div>
        </div>
    )
}