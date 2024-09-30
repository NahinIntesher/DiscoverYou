import React, { useEffect, useState } from "react";
import axios from "axios";
import PostBox from "./PostBox";
import dp from "../../../../assets/images/desert.jpg";
import { useParams, useNavigate } from "react-router-dom";
import CommentBox from "../../../CommonComponents/CommentBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";

export default function Post() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    
    const [updatePost, setUpdatePost] = useState(0);

    const handleChange = (e) => {
        const { value } = e.target;
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`
        setCommentContent(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(commentContent == "") {
            alert("Write something in comment box!");
            return;
        }
        
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/showcase/comment", {
            commentContent: commentContent,
            postId: postId
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Comment Success!");
            setCommentContent("");
            setUpdatePost((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        axios
          .get("http://localhost:3000/student/showcase/singlePost/"+postId)
          .then((res) => {
            const postData = res.data?.post || [];
            const commentsData = res.data?.comments || [];

            setPost(postData);
            setComments(commentsData);
          })
          .catch((error) => {
            console.error("Error fetching post:", error);
          });
    }, [updatePost]);

    return (
        <div className="mainContent">
            <Header title={"Post"}/>
            <div className="postBoxContainer">
                { 
                    post.length != 0 &&
                    <PostBox 
                        key={post.post_id}
                        postId={post.post_id}
                        posterName={post.user_name} 
                        postContent={post.post_content}
                        postTimeAgo={post.post_time_ago}
                        postMediaArray={post.media_array ? JSON.parse("["+post.media_array+"]") : []}
                        isPostReacted={post.is_reacted}
                        postReactionCount={post.reaction_count}
                        postCommentCount={post.comment_count}
                        postTime={post.post_date_time}
                    />
                }
            </div>
        </div>
    );
}