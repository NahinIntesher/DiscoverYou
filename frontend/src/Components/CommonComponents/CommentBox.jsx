import React from "react";
import dp from "../../assets/images/desert.jpg"

export default function CommentBox({commentContent, commentatorName, commentTimeAgo}) {
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
            <div className="profilePicture">
                <img src={dp}/>
            </div>
            <div className="commentContentBox">
                <div className="name">{commentatorName}</div>
                <div className="text">{commentContent}</div>
                <div className="details">{calculatePostAgoTime(commentTimeAgo)}</div>
            </div>
        </div>
    )
}