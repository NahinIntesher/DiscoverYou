import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "../../CommonComponents/CourseBox";
import NotFound from "../../CommonComponents/NotFound";
import EnrolledCourseBox from "../../CommonComponents/EnrolledCourseBox"

export default function MyCourses() {
    const [myCourses, setMyCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/courses/my")
            .then((res) => {
                console.log("Success");
                const myCoursesData = res.data?.myCourses || [];
                const enrolledCoursesData = res.data?.enrolledCourses || [];

                setMyCourses(myCoursesData);
                setEnrolledCourses(enrolledCoursesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <>
        <div className="tabContent">
            <div className="cousreSemiTitle">My Created Courses</div>
            {
            myCourses.length > 0 ?
            myCourses.map(function(course){
                return (
                    <CourseBox 
                        key={course.course_id}
                        id={course.course_id}
                        name={course.course_name}
                        mentorPicture={course.mentor_picture}
                        category={course.course_category}
                        description={course.course_description}
                        mentorName={course.course_mentor_name}
                        isJoined={course.is_joined}
                        totalMember={course.total_member}
                    />
                )
            })
            :
            <NotFound message="No course Found"/>
        }
        <div className="cousreSemiTitle">Enrolled Courses</div>
            {
            enrolledCourses.length > 0 ?
            enrolledCourses.map(function(course){
                return (
                    <EnrolledCourseBox
                        key={course.course_id}
                        id={course.course_id}
                        name={course.course_name}
                        category={course.course_category}
                        description={course.course_description}
                        mentorName={course.course_mentor_name}
                        isJoined={course.is_joined}
                        totalMember={course.total_member}
                        completedPercentage={course.completed_percentage}
                    />
                )
            })
            :
            <NotFound message="No course Found"/>
        }
        </div>
        </>
    );
}