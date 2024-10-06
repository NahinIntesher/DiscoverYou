import React, { useState } from "react";
import axios from "axios";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PostBox({
  postId,
  posterId,
  posterName,
  posterPicture,
  postCategory,
  postContent,
  postTime,
  postTimeAgo,
  postMediaArray,
  isPostReacted,
  postReactionCount,
  postCommentCount,
  user,
  admins,
}) {
  const [isReacted, setIsReacted] = useState(isPostReacted);
  const [reactionCount, setReactionCount] = useState(postReactionCount);
  const [reportBoxActive, setReportBoxActive] = useState(false);

  const navigate = useNavigate();

  function calculatePostAgoTime(timeDifference) {
    if (timeDifference < 60) {
      return "Few sec ago";
    } else if (timeDifference / 60 < 60) {
      return Math.floor(timeDifference / 60) + " min ago";
    } else if (timeDifference / (60 * 60) < 24) {
      return Math.floor(timeDifference / (60 * 60)) + " hour ago";
    } else {
      return Math.floor(timeDifference / (60 * 60 * 24)) + " day ago";
    }
  }

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

  function reactPost() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/showcase/react", {
        postId: postId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          if (res.data.message == "Liked") {
            setIsReacted(true);
            setReactionCount((prevCount) => prevCount + 1);
            // Send notification to the post owner
            axios
              .post("http://localhost:3000/student/notifications", {
                recipientId: posterId,
                notificationPicture: user.student_picture,
                notificationTitle: "Showcase Post Like",
                notificationMessage: `${user.student_name} liked your post in showcase!`,
                notificationLink: `/showcase/post/${postId}`,
              })
              .then((res) => {
                if (res.data.status === "Success") {
                  console.log("Successfully notification send");
                } else {
                  alert(res.data.Error);
                }
              })
              .catch((err) => console.log(err));
          } else {
            setIsReacted(false);
            setReactionCount((prevCount) => prevCount - 1);
          }
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  function reportPost() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/showcase/post-report", {
        postId: postId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          {
            admins.map((admin) => {
              axios
                .post("http://localhost:3000/admin/notifications", {
                  recipientId: admin.admin_id,
                  notificationPicture: user.student_picture,
                  notificationTitle: "Post Report",
                  notificationMessage: `${user.student_name} reported in ${posterName}'s post. Please check the details!`,
                  notificationLink: `/showcase/post/${postId}`,
                })
                .then((res) => {
                  if (res.data.status === "Success") {
                    console.log("Successfully notification send");
                  } else {
                    alert(res.data.Error);
                  }
                })
                .catch((err) => console.log(err));
            });
          }

          setReportBoxActive(false);
          alert("Post reported successfully!");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="postBox">
      <div className="profile">
        <Link to={"/profile/" + posterId} className="profilePicture">
          <img src={posterPicture ? posterPicture : dp} />
        </Link>
        <div className="profileDetail">
          <Link to={"/profile/" + posterId} className="name">
            {posterName}
          </Link>
          <div className="detail">{calculatePostAgoTime(postTimeAgo)}</div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setReportBoxActive(true);
            }}
          >
            <MaterialSymbol className="icon" size={40} icon="report" />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setReportBoxActive(true);
            }}
          >
            <MaterialSymbol className="icon" size={40} icon="delete" />
          </div>
        </div>
      </div>

      <div className={reportBoxActive ? "dialogBoxBackground" : "none"}>
        <div className="dialogBox">
          <div className="title">Report Post</div>
          <div className="details">Do you want to report this post?</div>
          <div className="buttonContainer">
            <div className="button" onClick={reportPost}>
              Yes
            </div>
            <div
              className="buttonAlt"
              onClick={() => {
                setReportBoxActive(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>

      <div className="postContent">{postContent}</div>
      {postMediaArray[0] != null && (
        <div className="mediaContainer">
          {postMediaArray.map(function (postMedia, index) {
            if (postMedia.media_type.split("/")[0] == "image") {
              return <img key={index} src={postMedia.media_url} />;
            } else if (postMedia.media_type.split("/")[0] == "audio") {
              return (
                <div key={index} className="audioContainer">
                  <MaterialSymbol
                    className="icon"
                    size={120}
                    icon="music_cast"
                  />
                  <audio controls>
                    <source
                      src={postMedia.media_url}
                      type={postMedia.media_type}
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              );
            } else if (postMedia.media_type.split("/")[0] == "video") {
              return (
                <video controls key={index}>
                  <source
                    src={postMedia.media_url}
                    type={postMedia.media_type}
                  />
                  Your browser does not support the video element.
                </video>
              );
            }
          })}
        </div>
      )}
      <div className="postDetails">
        <Link className="detail" to={"/showcase/reactors/" + postId}>
          {reactionCount} Likes
        </Link>
        <div className="divider"></div>
        <div className="detail">{postCommentCount} Comments</div>
        <div className="divider"></div>
        <div className="detail">{getDate(postTime)}</div>
        <div className="divider"></div>
        <div className="detail">{getPMTime(postTime)}</div>
        <div className="divider"></div>
        <div className="detail">{postCategory}</div>
      </div>
      <div className="postActionBoxContainer">
        {isReacted ? (
          <div className="postActionBox active" onClick={reactPost}>
            <MaterialSymbol className="icon" fill size={22} icon="favorite" />
            <div className="text">Liked</div>
          </div>
        ) : (
          <div className="postActionBox" onClick={reactPost}>
            <MaterialSymbol className="icon" size={22} icon="favorite" />
            <div className="text">Like</div>
          </div>
        )}
        <Link to={"/showcase/post/" + postId} className="postActionBox">
          <MaterialSymbol className="icon" size={22} icon="chat_bubble" />
          <div className="text">Comment</div>
        </Link>
      </div>
    </div>
  );
}
