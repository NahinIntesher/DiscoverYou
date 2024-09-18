import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/showcase.css";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import GivePostBox from "../../CommonComponents/GivePostBox";
import PostBox from "../../CommonComponents/PostBox";
import NotFound from "../../CommonComponents/NotFound";

export default function Showcase({user}) {    
    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(0);

    useEffect(() => {
        axios
          .get("http://localhost:3000/student/showcase/post")
          .then((res) => {
            const postsData = res.data?.posts || [];
            setPosts(postsData);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
    }, [updatePost]);
    
    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Showcase</div>
                </div>
            </div>
            <GivePostBox setUpdatePost={setUpdatePost} user={user}/>   
            <div className="postBoxContainer">
            {
                posts.length > 0 ?
                posts.map(function(post){
                    return (
                        <PostBox 
                            key={post.post_id}
                            postId={post.post_id}
                            posterName={post.user_name} 
                            postContent={post.post_content}
                            postTimeAgo={post.post_time_ago}
                            postMediaArray={JSON.parse("["+post.media_array+"]")}
                            isPostReacted={post.is_reacted}
                            postReactionCount={post.reaction_count}
                            postCommentCount={post.comment_count}
                            postTime={post.post_date_time}
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