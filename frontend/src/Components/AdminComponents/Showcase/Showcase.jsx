import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/showcase.css";
import "react-material-symbols/rounded";
import PostBox from "./PostBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function Showcase({ user }) {
    const [activeTab, setActiveTab] = useState(["allPost"]);

  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(0);

  const allInterests = [
    "Competitive Programming",
    "Web/App Designing",
    "Gaming",
    "Photography",
    "Debating",
    "Singing",
    "Writing",
    "Art & Craft",
    "Graphics Designing",
  ];

  const [formData, setFormData] = useState({
    sort: "s_p.post_date_time",
    category: allInterests.map((interest) => `'${interest}'`).join(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (prevFormData) {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/showcase/post", {
        params: formData,
      })
      .then((res) => {
        const postsData = res.data?.posts || [];
        setPosts(postsData);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [formData, updatePost]);

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Showcase</div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "reportedPost" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("reportedPost");
          }}
        >
          Reported Posts
        </div>
        <div
          className={activeTab == "allPost" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("allPost");
          }}
        >
          Approved Courses
        </div>
      </div>
      {
        activeTab == "allPost" && (
          <div className="postBoxContainer">
          <div className="smallBreak"></div>
          <div className="filterBox filterBoxShowcase">
            <div className="title">Filter</div>
            <div className="filters">
              <div className="filterName">Sort By</div>
              <div className="filter">
                <MaterialSymbol className="icon" size={22} icon="tune" />
                <select name="sort" onChange={handleInputChange}>
                  <option value="s_p.post_date_time">Newest First</option>
                  <option value="reaction_count">Most Liked</option>
                </select>
              </div>
              <div className="filterName">Category</div>
              <div className="filter">
                <InterestIcon category={formData.category} />
                <select name="category" onChange={handleInputChange}>
                  <option value={allInterests.map((interest) => `'${interest}'`)}>
                    All
                  </option>
                  {allInterests.map((interest) => (
                    <option value={`'${interest}'`}>{interest}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {posts.length > 0 ? (
            posts.map(function (post) {
              return (
                <PostBox
                  key={post.post_id}
                  postId={post.post_id}
                  posterId={post.user_id}
                  posterPicture={post.user_picture}
                  posterName={post.user_name}
                  postContent={post.post_content}
                  postTimeAgo={post.post_time_ago}
                  postMediaArray={JSON.parse("[" + post.media_array + "]")}
                  isPostReacted={post.is_reacted}
                  postReactionCount={post.reaction_count}
                  postCommentCount={post.comment_count}
                  postTime={post.post_date_time}
                  setUpdatePost={setUpdatePost}
                  deleteButtonAvailable={false}
                />
              );
            })
          ) : (
            <NotFound message="No Post Found" />
          )}
        </div>
        )
      }
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
