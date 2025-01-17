import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();

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

  const [courses, setcourses] = useState({});
  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    courseCategory: [],
  });

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/student/coursess/${courseId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const coursesData = res.data?.courses;
          setcourses(coursesData);

          setFormData({
            courseName: coursesData.course_name || "",
            courseDescription: coursesData.course_description || "",
            courseCategory: coursesData.course_category || [],
          });
        } else {
          alert("course not found!");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "courseCategory" ? [value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:3000/student/courses/update/${courseId}`, {
        courseId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`Course "${formData.courseName}" successfully edited!`);
          navigate("/course/pending");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="mainContent">
      <Header title={"Edit course"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Edit Your course</div>
            <div className="input">
              <label name="courseName">Course Name</label>
              <input
                name="courseName"
                onChange={handleChange}
                type="text"
                value={formData.courseName}
                placeholder="Enter course name"
              />
            </div>
            <div className="input">
              <label htmlFor="courseCategory">Course Category</label>
              <select
                name="courseCategory"
                value={formData.courseCategory}
                onChange={handleChange}
              >
                {allInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <label htmlFor="courseDescription">course Description</label>
              <textarea
                name="courseDescription"
                onChange={handleChange}
                value={formData.courseDescription}
                placeholder="Enter course description"
              />
            </div>
            <button>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
