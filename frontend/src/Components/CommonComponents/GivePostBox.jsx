import React, { useState } from "react";
import axios from "axios";
import "../../assets/styles/showcase.css";
import dp from "../../assets/images/desert.jpg";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function GivePostBox({user,setUpdatePost}) {
    const [formData, setFormData] = useState({
        content: "",
        media: []
    });
    const categories = user.interests;
    
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [postCategory, setPostCategory] = useState(categories[0]);

    const [durations, setDurations] = useState({});
    
    function formatedDuration(duration) {
        return `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
    }

    const handleLoadedMetadata = (file, index, event) => {
        const duration = event.target.duration;
        setDurations((prevDurations) => ({
            ...prevDurations,
            [index]: duration,
        }));
    };
 
    function removeMedia(index) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                media: prevFormData.media.filter((_, i) => i !== index)
            };
        });
    }

    const handleFileChange = (event) => {
        let mimetype = event.target.files[0].type;
        console.log(mimetype);
        if(mimetype.startsWith("image") || mimetype.startsWith("video") || mimetype.startsWith("audio")) {
            setFormData(function(oldFormData) {
                return {
                    ...oldFormData,
                    media: [...oldFormData.media, ...Array.from(event.target.files)],
                }
            });
        }
        else {
            alert("File should be image, video or audio!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`
        setFormData(function(oldFormData) {
            return {
                ...oldFormData,
                [name]: value,
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalData = new FormData();
        finalData.append('content', formData.content);
        finalData.append('category', postCategory);
        formData.media.forEach((file, index) => {
            finalData.append(`media`, file); 
        });
        
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/showcase/post", finalData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Post Success!");
            setUpdatePost((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };
    
    return (
        <div className="givePostBox">
            <form onSubmit={handleSubmit}>
                <div className="profilePicture">
                    <img src={dp}/>
                </div>
                <div className="textBox">
                    <div className="textareaContainer">
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Write something..."
                            onChange={handleChange}
                        />                        
                        <div className="mediaContainer">
                            {
                                formData.media.map(function(file, index) {
                                    if(file.type.split('/')[0] == "image") {
                                        return (
                                            <div className="media" key={index}>
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview ${index}`}
                                                />
                                                <div className="remove" onClick={function(){removeMedia(index)}}>
                                                    <MaterialSymbol className="icon" size={20} icon="close"/>
                                                </div>
                                            </div>
                                        );
                                    }
                                    else if(file.type.split('/')[0] == "audio") {
                                        return (
                                            <div className="media" key={index}>
                                                <audio
                                                    src={URL.createObjectURL(file)}
                                                    onLoadedMetadata={(event) => handleLoadedMetadata(file, index, event)}
                                                />
                                                <MaterialSymbol className="audio" size={42} icon="mic"/>
                                                <div className="duration">{durations[index] ? formatedDuration(durations[index]) : '00.00'}</div>
                                                <div className="remove" onClick={function(){removeMedia(index)}}>
                                                    <MaterialSymbol className="icon" size={20} icon="close"/>
                                                </div>
                                            </div>
                                        );
                                    }
                                    else if(file.type.split('/')[0] == "video") {
                                        return (
                                            <div className="media" key={index}>
                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    onLoadedMetadata={(event) => handleLoadedMetadata(file, index, event)}
                                                />
                                                <MaterialSymbol className="audio" size={42} icon="movie"/>
                                                <div className="duration">{durations[index] ? formatedDuration(durations[index]) : '00.00'}</div>
                                                <div className="remove" onClick={function(){removeMedia(index)}}>
                                                    <MaterialSymbol className="icon" size={20} icon="close"/>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>
                    <button className="postButton" type="submit">Post</button>
                    <div className="addMediaContainer">
                        <div className="changeCategory" onClick={function(){setIsCategoryOpen((prevStatus) => prevStatus ? false : true)}}>
                            {postCategory === "Competitive Programming" && (
                            <MaterialSymbol className="icon" size={24} icon="code" />
                            )}
                            {postCategory === "Singing" && (
                            <MaterialSymbol className="icon" size={24} icon="queue_music" />
                            )}
                            {postCategory === "Graphics Designing" && (
                            <MaterialSymbol className="icon" size={24} icon="polyline" />
                            )}
                            {postCategory === "Photography" && (
                            <MaterialSymbol className="icon" size={24} icon="photo_camera" />
                            )}
                            {postCategory === "Web/App Designing" && (
                            <MaterialSymbol className="icon" size={24} icon="web" />
                            )}
                            {postCategory === "Writing" && (
                            <MaterialSymbol className="icon" size={24} icon="edit_note" />
                            )}
                            {postCategory === "Art & Craft" && (
                            <MaterialSymbol className="icon" size={24} icon="draw" />
                            )}
                            {postCategory === "Debating" && (
                            <MaterialSymbol className="icon" size={24} icon="communication" />
                            )}
                            {postCategory === "Gaming" && (
                            <MaterialSymbol className="icon" size={24} icon="sports_esports" />
                            )}
                            <div className="text">{postCategory}</div>                                
                            <div className="categoryContainer" style={{display: isCategoryOpen ? "block" : "none"}}>
                                {
                                    categories.map(function(category){
                                        return (
                                            <div key={category} onClick={function(){setPostCategory(category)}} className="category">{category}</div>
                                        );
                                    })
                                }
                            </div>
                            <MaterialSymbol className="dropdownIcon" size={20} icon="keyboard_arrow_down"/>
                        </div>
                        <div className="addMedia">
                            <MaterialSymbol className="icon" size={22} icon="photo"/>
                            <div className="text">Add Image</div>
                            <input type="file" id="media" name="media" multiple onChange={handleFileChange} accept="image/*"/>
                        </div>
                        <div className="addMedia">
                            <MaterialSymbol className="icon" size={22} icon="movie"/>
                            <div className="text">Add Video</div>
                            <input type="file" id="media" name="media" multiple onChange={handleFileChange} accept="video/*"/>
                        </div>
                        <div className="addMedia">
                            <MaterialSymbol className="icon" size={22} icon="mic"/>
                            <div className="text">Add Audio</div>
                            <input type="file" id="media" name="media" multiple onChange={handleFileChange} accept="audio/*"/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}