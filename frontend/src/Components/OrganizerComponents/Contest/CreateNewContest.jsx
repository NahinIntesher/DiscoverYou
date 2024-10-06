import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import NotFound from "../../CommonComponents/NotFound";

export default function CreateNewContest({ interests }) {
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
        contestName: "",
        contestDescription: "",
        contestCategory: allInterests[0],
        startTime: "",
        endTime: "",
        problems: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(function (oldFormData) {
            return {
                ...oldFormData,
                [name]: value,
            }
        });
    };

    const addMaterial = () => {
        if (formData.tempMaterial != "" && formData.tempMaterialName != "") {
            setFormData(function (oldFormData) {
                return {
                    ...oldFormData,
                    courseMaterials: [
                        ...oldFormData.courseMaterials,
                        ...Array.from(oldFormData.tempMaterial),
                    ],
                    courseMaterialNames: [
                        ...oldFormData.courseMaterialNames,
                        oldFormData.tempMaterialName
                    ]
                };
            });
        }
        else {
            alert("You did not add any material!")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.defaults.withCredentials = true;
        axios
            .post("http://localhost:3000/organizer/contest/new", formData)
            .then((res) => {
                if (res.data.status === "Success") {
                    console.log("Community Creation Success!");
                    navigate(-1);
                    alert("Contest successfully submitted for approval!");
                    //            setUpdatePost((prevData) => prevData+1);
                } else {
                    alert(res.data.Error);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="mainContent">
            <Header title={"New Contest"} />
            <div className="formBoxContainer">
                <div className="formBox">
                    <form onSubmit={handleSubmit}>
                        <div className="title">Create New Contest</div>
                        <div className="input">
                            <label name="contestName">Contest Name</label>
                            <input
                                name="contestName"
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter contest name"
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="contestCategory">Contest Category</label>
                            <select
                                name="contestCategory"
                                onChange={handleChange}
                            >
                                {
                                    allInterests.map(function (interest) {
                                        return <option value={interest}>{interest}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="input">
                            <label htmlFor="contestDescription">Contest Description</label>
                            <textarea
                                name="contestDescription"
                                onChange={handleChange}
                                placeholder="Enter contest description"
                            />
                        </div>
                        <div className="input">
                            <label name="startTime">Starting Time</label>
                            <input
                                name="startTime"
                                onChange={handleChange}
                                type="datetime-local"
                                placeholder="Enter contest starting time"
                            />
                        </div>
                        <div className="input">
                            <label name="endTime">Ending Time</label>
                            <input
                                name="endTime"
                                onChange={handleChange}
                                type="datetime-local"
                                placeholder="Enter contest ending time"
                            />
                        </div>

                        <div className="smallBreak"></div>
                        <div className="title">Add Problems</div>
                        {/* Course Materials */}

                        <div className="addMaterialSpecial">
                            <div className="input">
                                <label name="problemNameTemp">Problem Name</label>
                                <input
                                    name="problemNameTemp"
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter problme name"
                                />
                            </div>
                            <div className="input">
                                <label name="problemDescriptionTemp">Problem Description</label>
                                <input
                                    name="problemDescriptionTemp"
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter problem description"
                                />
                            </div>
                            <div className="input">
                                <label name="sampleInputTemp">Sample Input</label>
                                <textarea
                                    name="sampleInputTemp"
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter sample input"
                                />
                            </div>
                            <div className="input">
                                <label name="sampleOutputTemp">Sample Output</label>
                                <textarea
                                    name="sampleOutputTemp"
                                    // onChange={handleChange}
                                    type="text"
                                    placeholder="Enter sample output"
                                />
                            </div>
                            <div className="addButton" onClick={addMaterial} style={{ cursor: "default" }}>Add</div>
                        </div>
                        {formData.problems.length ?
                            <div className="materialContainer">
                                {formData.problems.map(function (file, index) {
                                    return (
                                        <div className="materialBox" key={index}>
                                            <div className="textContainer">
                                                <div className="name">{formData.problems[index]}</div>
                                                <div className="format">Image</div>
                                            </div>
                                            <div className="rejectButton" onClick={() => removeMedia(index)}>
                                                <MaterialSymbol className="icon" size={22} icon="delete" />
                                                <div className="text">Delete</div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {formData.problems.length < 3 && (
                                    <p className="bottomRequired">
                                        Add at least 1 problems of you course
                                    </p>
                                )}
                            </div>
                            : <div className="materialContainer">
                                <NotFound message="You did not add any problems!" />
                            </div>
                        }

                        <button>Submit For Approval</button>
                    </form>
                </div>
            </div>
        </div>
    )
}