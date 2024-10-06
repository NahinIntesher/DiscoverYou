import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function CreateNewWebinar({interests}) {
    const navigate = useNavigate();

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
        webinarName: "",
        webinarDescription: "",
        webinarCategory: allInterests[0],
        startTime: "",
        endTime: "",
        meetingLink: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(function(oldFormData) {
            return {
                ...oldFormData,
                [name]: value,
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/organizer/webinar/new", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Webinar Creation Success!");
            navigate(-1);
            alert("Webinar successfully submitted for approval!");
//            setUpdatePost((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className="mainContent">
            <Header title={"New Webinar"}/>
            <div className="formBoxContainer">
                <div className="formBox">
                    <form onSubmit={handleSubmit}>
                        <div className="title">Create New Webinar</div>
                        <div className="input">
                            <label name="webinarName">Webinar Name</label>
                            <input 
                                name="webinarName" 
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter webinar name"
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="webinarCategory">Webinar Category</label>
                            <select 
                                name="webinarCategory"
                                onChange={handleChange}
                            >
                                {
                                    allInterests.map(function(interest) {
                                        return <option value={interest}>{interest}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="input">
                            <label htmlFor="webinarDescription">Webinar Description</label>
                            <textarea
                                name="webinarDescription"
                                onChange={handleChange}
                                placeholder="Enter webinar description"
                            />
                        </div>
                        <div className="input">
                            <label name="startTime">Starting Time</label>
                            <input 
                                name="startTime" 
                                onChange={handleChange}
                                type="datetime-local"
                                placeholder="Enter webinar starting time"
                            />
                        </div>
                        <div className="input">
                            <label name="endTime">Ending Time</label>
                            <input 
                                name="endTime" 
                                onChange={handleChange}
                                type="datetime-local"
                                placeholder="Enter webinar ending time"
                            />
                        </div>
                        <div className="input">
                            <label name="meetingLink">Meeting Link</label>
                            <input 
                                name="meetingLink" 
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter webinar meeting link"
                            />
                        </div>
                        <button>Submit For Approval</button>
                    </form>
                </div>
            </div>
        </div>
    )
}