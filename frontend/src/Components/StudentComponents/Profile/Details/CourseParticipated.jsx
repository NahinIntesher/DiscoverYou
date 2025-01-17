import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "./CourseBox";
import NotFound from "../../../CommonComponents/NotFound";
import EnrolledCourseBox from "./EnrolledCourseBox";
import Header from "../../../CommonComponents/Header";
export default function CourseParticipated({ user }) {
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
    <div className="mainContent">
      <Header
        title={`Courses participated`}
        semiTitle={`by ${user.student_name}`}
      />
      <div className="tabContent">
        <div className="cousreSemiTitle">Created Courses</div>
        {myCourses.length > 0 ? (
          myCourses.map(function (course) {
            return (
              <CourseBox
                key={course.course_id}
                id={course.course_id}
                name={course.course_name}
                mentorPicture={course.mentor_picture}
                mentorId={course.mentor_id}
                category={course.course_category}
                description={course.course_description}
                mentorName={course.course_mentor_name}
                isJoined={course.is_joined}
                totalMember={course.total_member}
              />
            );
          })
        ) : (
          <NotFound message="No course Found" />
        )}
        <div className="cousreSemiTitle">Enrolled Courses</div>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map(function (course) {
            return (
              <EnrolledCourseBox
                key={course.course_id}
                id={course.course_id}
                name={course.course_name}
                mentorPicture={course.mentor_picture}
                mentorId={course.mentor_id}
                category={course.course_category}
                description={course.course_description}
                mentorName={course.course_mentor_name}
                isJoined={course.is_joined}
                totalMember={course.total_member}
                completedPercentage={course.completed_percentage}
              />
            );
          })
        ) : (
          <NotFound message="No course Found" />
        )}
      </div>
    </div>
  );
}
