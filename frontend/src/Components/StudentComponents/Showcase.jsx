import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/showcase.css";
import dp from "../../assets/images/desert.jpg";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import GivePostBox from "../CommonComponents/GivePostBox";
import PostBox from "../CommonComponents/PostBox";

export default function Showcase({user}) {    
    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(0);

    useEffect(() => {
        axios
          .get("http://localhost:3000/showcase/post")
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
            <GivePostBox setUpdatePost={setUpdatePost} user={user}/>       
            {
                posts.map(function(post){
                    return (
                        <PostBox 
                            key={post.post_id}
                            posterName={post.poster_name} 
                            postContent={post.post_content}
                            postTimeAgo={post.post_time_ago}
                            //postMediaArray={JSON.parse("["+post.media_array+"]")}
                        />
                    );
                })
            }     
        </div>
    );
}