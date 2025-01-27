import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/showcase.css";
import 'react-material-symbols/rounded';
import PostBox from "./PostBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function Showcase({user, admins}) {    
    const [posts, setPosts] = useState([]);

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
        category: allInterests.map((interest)=> `'${interest}'`).join()
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
          .get("http://localhost:3000/organizer/showcase/post", {
            params: formData
          })
          .then((res) => {
            const postsData = res.data?.posts || [];
            setPosts(postsData);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
    }, [formData]);
    
    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Showcase</div>
                </div>
            </div>
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
                            <InterestIcon category={formData.category}/>
                            <select name="category" onChange={handleInputChange}>
                                <option value={allInterests.map((interest)=> `'${interest}'`)}>All</option>
                                {allInterests.map((interest)=> 
                                    <option value={`'${interest}'`}>{interest}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            {
                posts.length > 0 ?
                posts.map(function(post){
                    return (
                        <PostBox 
                            key={post.post_id}
                            postId={post.post_id}
                            posterName={post.user_name} 
                            posterId={post.user_id} 
                            posterPicture={post.user_picture} 
                            postContent={post.post_content}
                            postTimeAgo={post.post_time_ago}
                            postMediaArray={JSON.parse("["+post.media_array+"]")}
                            isPostReacted={post.is_reacted}
                            postReactionCount={post.reaction_count}
                            postCommentCount={post.comment_count}
                            postTime={post.post_date_time}
                            user={user}
                            admins={admins}
                        />
                    );
                })
                :
                <NotFound message="No Post Found"/>
            }
            
            </div>        
        </div>
    );
}


function InterestIcon(data) {
    console.log(data);
    if (data.category == "'Competitive Programming'") {
      return <MaterialSymbol className="icon" size={22} icon="code" />
    }
    else if (data.category == "'Singing'") {
      return <MaterialSymbol className="icon" size={22} icon="queue_music" />
    }
    else if (data.category == "'Graphics Designing'") {
      return <MaterialSymbol className="icon" size={22} icon="polyline" />
    }
    else if (data.category == "'Photography'") {
      return <MaterialSymbol className="icon" size={22} icon="photo_camera" />
    }
    else if (data.category == "'Web/App Designing'") {
      return <MaterialSymbol className="icon" size={22} icon="web" />
    }
    else if (data.category == "'Writing'") {
      return <MaterialSymbol className="icon" size={22} icon="edit_note" />
    }
    else if (data.category == "'Art & Craft'") {
      return <MaterialSymbol className="icon" size={22} icon="draw" />
    }
    else if (data.category == "'Debating'") {
      return <MaterialSymbol className="icon" size={22} icon="communication" />
    }
    else if (data.category == "'Gaming'") {
      return <MaterialSymbol className="icon" size={22} icon="sports_esports" />
    }
    else {
        return <MaterialSymbol className="icon" size={22} icon="interests" />
    }
}

