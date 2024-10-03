import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/styles/community.css";
import MyCourses from "./MyCourses";
import BrowseCourses from "./BrowseCourses";
import "../../../assets/styles/course.css";

export default function Course({user}) {
    const [activeTab, setActiveTab] = useState(["browseCourses"]);
    
    const [pendingParticipantsNo, setPendingParticipantsNo] = useState(0);
    const [pendingCoursesNo, setPendingCoursesNo] = useState(0);
    
    const navigate = useNavigate();

    function createCourse() {
        if(user.student_points >= 500) {
            navigate("/course/new")
        }
        else {
            alert("You should acheive atleast 500 points to create course!");
        }
    }

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/courses/pending-details")
            .then((res) => {
                console.log("Success");
                const pendingParticipantsNo = res.data?.pendingParticipantsNo || [];
                const pendingCoursesNo = res.data?.pendingCoursesNo || [];

                setPendingParticipantsNo(pendingParticipantsNo);
                setPendingCoursesNo(pendingCoursesNo);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Course</div>
                    <div className="buttonContainer">
                        <div onClick={createCourse} className={user.student_points >= 500 ? "button" : "button inactiveButton"}>
                            <MaterialSymbol className="icon" size={24} icon="add" />
                            <div className="text">Create New course</div>
                        </div>
                    </div>
                </div>
            </div>
            {pendingCoursesNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        Your {pendingCoursesNo} courses approval are in pending.
                    </div>
                    <Link to={"/course/pending"} className="button">
                        Pending Courses
                    </Link>
                </div>
            }
            {pendingParticipantsNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        {pendingParticipantsNo} members approval pending in your courses.
                    </div>
                    <Link to={"/course/participants/pending"} className="button">
                        Pending participants
                    </Link>
                </div>
            }
            <div className="tabContainer">
                <div className={activeTab == "myCourses" ? "activeTab" : "tab"} style={{ cursor: "pointer" }} onClick={function(){setActiveTab("myCourses")}}>My Courses</div>
                <div className={activeTab == "browseCourses" ? "activeTab" : "tab"} style={{ cursor: "pointer" }} onClick={function(){setActiveTab("browseCourses")}}>Browse Courses</div>
            </div>
            {
                activeTab == "myCourses" &&
                <MyCourses />
            }
            {
                activeTab == "browseCourses" &&
                <BrowseCourses />
            }
        </div>
    );
}