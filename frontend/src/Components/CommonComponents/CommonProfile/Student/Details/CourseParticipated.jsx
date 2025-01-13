import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "./CourseBox";
import NotFound from "../../../../CommonComponents/NotFound";
import EnrolledCourseBox from "./EnrolledCourseBox";
import Header from "../../../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function CourseParticipated({}) {
  const { paramId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (paramId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${paramId}`)
        .then((res) => {
          console.log(res.data);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [paramId]);

  const [courseResults, setCourseResults] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/dynamic-profile/${paramId}`)
      .then((res) => {
        console.log(res.data);
        setCourseResults(res.data.courseResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.id]);

  return (
    <div className="mainContent">
      <Header title={`Courses Participated`} semiTitle={`By ${user.name}`} />
      <div className="tabContent">
        <div className="cousreSemiTitle">Enrolled Courses</div>
        {courseResults.length > 0 ? (
          courseResults.map(function (course) {
            return (
              <EnrolledCourseBox
                key={course.course_id}
                id={course.course_id}
                name={course.course_name}
                mentorPicture={course.mentor_picture}
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
