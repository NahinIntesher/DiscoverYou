import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingParticipantBox from "../../CommonComponents/PendingParticipantBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingCourseBox from "./PendingCourseBox";

export default function PendingCourses({interests}) {
    const [pendingCourses, setPendingCourses] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/courses/pending")
            .then((res) => {
                console.log("Success");
                const pendingCourses = res.data?.courses || [];
                setPendingCourses(pendingCourses);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Courses"}/>
            { 
                pendingCourses.length ?
                <div className="pendingMembersList">
                    {pendingCourses.map(function(course, index){
                        return(
                            <PendingCourseBox 
                                key={course.course_id}
                                id={course.course_id}
                                name={course.course_name}
                                category={course.course_category}
                                description={course.course_description}
                                mentorName={course.course_mentor_name}
                                mentorId={course.mentor_id}
                                setUpdate={setUpdate}
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="supervisor_account" message={"You have no pending course!"}/>
            }
        </div>
    )
}