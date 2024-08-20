import React from "react";
import dp from "../../assets/images/desert.jpg";

export default function PostBox({posterName, postContent, postTimeAgo, postMediaArray}) {
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
        <div className="postBox">
            <div className="profile">
                <div className="profilePicture">
                    <img src={dp}/>
                </div>
                <div className="profileDetail">
                    <div className="name">{posterName}</div>
                    <div className="detail">{calculatePostAgoTime(postTimeAgo)}</div>
                </div>
            </div>
            <div className="postContent">{postContent}</div>
            {/*
                postMediaArray[0] != null && postMediaArray.map(function(postMedia){
                    return <>{postMedia.media_type}</>
                })
            */
            }
        </div>
    );
}