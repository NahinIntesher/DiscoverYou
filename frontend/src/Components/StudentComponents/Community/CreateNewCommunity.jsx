import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function CreateNewCommunity({interests}) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        communityName: "",
        communityCategory: interests[0],
        communityDescription: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // e.target.style.height = 'inherit';
        // e.target.style.height = `${e.target.scrollHeight}px`
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
        .post("http://localhost:3000/student/community/new", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Community Creation Success!");
            navigate(-1);
//            setUpdatePost((prevData) => prevData+1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className="mainContent">
            <Header title={"New Community"}/>
            <div className="formBoxContainer">
                <div className="formBox">
                    <form onSubmit={handleSubmit}>
                        <div className="title">Create New Community</div>
                        <div className="input">
                            <label name="communityName">Community Name</label>
                            <input 
                                name="communityName" 
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter community name"
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="communityCategory">Community Category</label>
                            <select 
                                name="communityCategory"
                                onChange={handleChange}
                            >
                                {
                                    interests.map(function(interest) {
                                        return <option value={interest}>{interest}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="input">
                            <label htmlFor="communityDescription">Community Description</label>
                            <textarea
                                name="communityDescription"
                                onChange={handleChange}
                                placeholder="Enter community description"
                            />
                        </div>
                        <button>Submit for Approval</button>
                    </form>
                </div>
            </div>
        </div>
    )
}