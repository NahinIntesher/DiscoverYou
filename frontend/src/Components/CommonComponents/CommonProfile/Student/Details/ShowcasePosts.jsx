import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../../assets/styles/showcase.css";
import "react-material-symbols/rounded";
import NotFound from "../../../../CommonComponents/NotFound";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import Header from "../../../../CommonComponents/Header";
import PostBox from "./PostBox";
import { useParams } from "react-router-dom";

export default function CommonShowcasePosts({}) {
  const { paramId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (paramId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${paramId}`)
        .then((res) => {
          console.log(res.data);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [paramId]);

  const [showcaseResults, setShowcaseResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/dynamic-profile/${paramId}`)
      .then((res) => {
        console.log(res.data);
        setShowcaseResults(res.data.showcaseResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

  return (
    <div className="mainContent">
      <Header title={`Webinar participated by ${user.name}`} />
      <div className="postBoxContainer">
        {showcaseResults.length > 0 ? (
          showcaseResults.map(function (post) {
            return (
              <PostBox
                key={post.post_id}
                postId={post.post_id}
                posterName={post.user_name}
                postContent={post.post_content}
                posterPicture={post.user_picture}
                postTimeAgo={post.post_time_ago}
                postMediaArray={JSON.parse("[" + post.media_array + "]")}
                isPostReacted={post.is_reacted}
                postReactionCount={post.reaction_count}
                postCommentCount={post.comment_count}
                postTime={post.post_date_time}
                postCategory={post.post_category}
              />
            );
          })
        ) : (
          <NotFound message="No Post Found" />
        )}
      </div>
    </div>
  );
}

function InterestIcon(data) {
  console.log(data);
  if (data.category == "'Competitive Programming'") {
    return <MaterialSymbol className="icon" size={22} icon="code" />;
  } else if (data.category == "'Singing'") {
    return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
  } else if (data.category == "'Graphics Designing'") {
    return <MaterialSymbol className="icon" size={22} icon="polyline" />;
  } else if (data.category == "'Photography'") {
    return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
  } else if (data.category == "'Web/App Designing'") {
    return <MaterialSymbol className="icon" size={22} icon="web" />;
  } else if (data.category == "'Writing'") {
    return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
  } else if (data.category == "'Art & Craft'") {
    return <MaterialSymbol className="icon" size={22} icon="draw" />;
  } else if (data.category == "'Debating'") {
    return <MaterialSymbol className="icon" size={22} icon="communication" />;
  } else if (data.category == "'Gaming'") {
    return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
  } else {
    return <MaterialSymbol className="icon" size={22} icon="interests" />;
  }
}
