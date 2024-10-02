import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "./CourseBox";
import NotFound from "../../CommonComponents/NotFound";
import PendingCourseBox from "./PendingCourseBox";

export default function PendingCourses() {
    const [courses, setCourses] = useState([]);
    const [update, setUpdate] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/course/pending")
            .then((res) => {
                console.log("Success");
                const coursesData = res.data?.courses || [];
                setCourses(coursesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="tabContent">
        {   courses.length > 0 ?
            courses.map(function(course){
                return (
                    <PendingCourseBox 
                        key={course.course_id}
                        id={course.course_id}
                        name={course.course_name}
                        category={course.course_category}
                        description={course.course_description}
                        mentorName={course.course_mentor_name}
                        mentorPicture={course.mentor_picture}
                        mentorId={course.course_mentor_id}
                        setUpdate={setUpdate}
                        totalMember={course.total_member}
                    />
                )
            })
            :
            <NotFound message="No Pending Courses Available"/>
        }
        </div>
    );
}