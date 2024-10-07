import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function NewHiring({ interests, user, admins }) {
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
    companyName: "",
    jobName: "",
    jobCategory: "Competitive Programming",
    jobDescription: "",
    jobSalary: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      .post("http://localhost:3000/organizer/hiring/new", formData)
      .then((res) => {
        if (res.data.status === "Success") {
          {
            admins.map((admin) => {
              axios
                .post("http://localhost:3000/admin/notifications", {
                  recipientId: admin.admin_id,
                  notificationPicture: user.organizer_picture,
                  notificationTitle: "Hiring Creation Request",
                  notificationMessage: `${user.organizer_name} have created a new Hiring are in pending!`,
                  notificationLink: `/hiring`,
                })
                .then((res) => {
                  if (res.data.status === "Success") {
                    console.log("Successfully notification send");
                  } else {
                    alert(res.data.Error);
                  }
                })
                .catch((err) => console.log(err));
            });
          }

          console.log("Hiring Creation Success!");
          navigate("/hiring");
          alert("Hiring successfully submitted for approval!");
          setUpdatePost((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
    console.log(formData);
  };
  return (
    <div className="mainContent">
      <Header title={"New Hiring"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Create New Hiring</div>
            <div className="input">
              <label name="companyName">Company Name</label>
              <input
                name="companyName"
                onChange={handleChange}
                type="text"
                placeholder="Enter company name"
              />
            </div>
            <div className="input">
              <label name="jobName">Job Name</label>
              <input
                name="jobName"
                onChange={handleChange}
                type="text"
                placeholder="Enter job name"
              />
            </div>
            <div className="input">
              <label htmlFor="jobCategory">Job Category</label>
              <select name="jobCategory" onChange={handleChange}>
                {allInterests.map(function (interest) {
                  return <option value={interest}>{interest}</option>;
                })}
              </select>
            </div>
            <div className="input">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                name="jobDescription"
                onChange={handleChange}
                placeholder="Enter job description"
              />
            </div>
            <div className="input">
              <label name="endTime">Last Date For Apply</label>
              <input
                name="endTime"
                onChange={handleChange}
                type="datetime-local"
                placeholder="Enter webinar ending time"
              />
            </div>
            <div className="input">
              <label name="jobSalary">Job Salary</label>
              <input
                name="jobSalary"
                onChange={handleChange}
                type="number"
                placeholder="Enter job salray (৳)"
                required
              />
            </div>

            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
