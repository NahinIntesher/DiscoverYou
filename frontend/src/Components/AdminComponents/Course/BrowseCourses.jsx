import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "./CourseBox";
import NotFound from "../../CommonComponents/NotFound";

export default function BrowseCourses() {
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/course")
            .then((res) => {
                console.log("Success");
                const coursesData = res.data?.courses || [];
                setCourses(coursesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="tabContent">
        {   courses.length > 0 ?
            courses.map(function(course){
                return (
                    <CourseBox 
                        key={course.course_id}
                        id={course.course_id}
                        name={course.course_name}
                        category={course.course_category}
                        description={course.course_description}
                        mentorName={course.course_mentor_name}
                        isJoined={course.is_joined}
                        totalMember={course.total_member}
                    />
                )
            })
            :
            <NotFound message="No Course Found"/>
        }
        </div>
    );
}