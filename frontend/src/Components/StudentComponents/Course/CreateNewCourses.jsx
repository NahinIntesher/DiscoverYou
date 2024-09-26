import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function CreateNewCourse({ interests }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCategory: interests[0],
    courseDescription: "",
    coursePrice: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // e.target.style.height = 'inherit';
    // e.target.style.height = `${e.target.scrollHeight}px`
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/courses/new", formData)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Course Creation Success!");
          navigate(-1);
          alert("Course successfully submitted for approval!");
          //            setUpdatePost((prevData) => prevData+1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mainContent">
      <Header title={"New Course"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Create New Course</div>
            <div className="input">
              <label name="courseName">Course Name</label>
              <input
                name="courseName"
                onChange={handleChange}
                type="text"
                placeholder="Enter course name"
              />
            </div>
            <div className="input">
              <label htmlFor="courseCategory">Course Category</label>
              <select name="courseCategory" onChange={handleChange}>
                {interests.map(function (interest) {
                  return <option value={interest}>{interest}</option>;
                })}
              </select>
            </div>
            <div className="input">
              <label htmlFor="coursePrice">Course Price</label>
              <input
                name="coursePrice"
                onChange={handleChange}
                type="number"
                placeholder="Enter course price $"
              />
            </div>
            <div className="input">
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                name="courseDescription"
                onChange={handleChange}
                placeholder="Enter course description"
              />
            </div>
            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
