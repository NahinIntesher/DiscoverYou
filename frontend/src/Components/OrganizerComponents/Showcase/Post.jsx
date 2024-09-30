import React, { useEffect, useState } from "react";
import axios from "axios";
import PostBox from "./PostBox";
import dp from "../../../assets/images/default.jpg";
import { useParams, useNavigate } from "react-router-dom";
import CommentBox from "../../CommonComponents/CommentBox";
import NotFound from "../../CommonComponents/NotFound";
import Header from "../../CommonComponents/Header";

export default function Post({user}) {
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
        .post("http://localhost:3000/organizer/showcase/comment", {
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
          .get("http://localhost:3000/organizer/showcase/singlePost/"+postId)
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
                        posterId={post.user_id} 
                        posterPicture={post.user_picture}
                        postContent={post.post_content}
                        postTimeAgo={post.post_time_ago}
                        postMediaArray={post.media_array ? JSON.parse("["+post.media_array+"]") : []}
                        isPostReacted={post.is_reacted}
                        postReactionCount={post.reaction_count}
                        postCommentCount={post.comment_count}
                        postTime={post.post_date_time}
                    />
                }
                <div className="giveCommentBox">
                    <form onSubmit={handleSubmit}>
                        <div className="profilePicture">
                            <img src={user.organizer_picture ? user.organizer_picture : dp}/>
                        </div>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Write something..."
                            onChange={handleChange}
                            value={commentContent}
                        />        
                        <button className="postButton" type="submit">Comment</button>
                    </form>
                </div>
                <div className="commentBoxContainer">
                    <div className="title">Comments</div>
                    {   comments.length > 0 ?
                        comments.map(function(comment){
                            return (
                                <CommentBox commentatorId={comment.commentator_id} commentatorPicture={comment.commentator_picture} commentContent={comment.comment_content} commentatorName={comment.commentator_name} commentTimeAgo={comment.comment_time_ago}/>
                            )
                        })
                        :
                        <NotFound message={"No comment!"}/>
                    }
                </div>
            </div>
        </div>
    );
}