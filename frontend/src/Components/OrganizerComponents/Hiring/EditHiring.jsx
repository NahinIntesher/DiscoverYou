import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function EditHiring({ interests }) {
  const { hiringId } = useParams();
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

  const [hirings, setHirings] = useState({}); // Start as null
  const [applicants, setApplicants] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    jobName: "",
    jobCategory: "Competitive Programming",
    jobDescription: "",
    jobSalary: "",
    endTime: "",
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/organizer/hirings/${hiringId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const { hiring, applicants } = res.data;
          setHirings(hiring);
          setFormData({
            companyName: hiring.company_name || "",
            jobName: hiring.job_name || "",
            jobCategory: hiring.job_category || "",
            jobDescription: hiring.job_description || "",
            jobSalary: hiring.job_salary || "",
            endTime: hiring.end_time || "",
          });
          setApplicants(applicants || []);
        } else {
          alert(res.data.Error);
          console.log(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [hiringId]); // Add hiringId to the dependency array
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((oldFormData) => ({
      ...oldFormData,
      [name]: value,
    }));
  };

  const editDetails = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    // Submit form logic
    axios
      .post(`http://localhost:3000/organizer/hirings/edit/${hiringId}`, {
        hiringId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`Hiring "${formData.jobName}" successfully edited!`);
          navigate("/hiring/pending");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
    console.log(formData);
  };

  return (
    <div className="mainContent">
      <Header title={"Edit Hiring"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={editDetails}>
            <div className="title">Edit Hiring Details</div>
            <div className="input">
              <label name="companyName">Company Name</label>
              <input
                name="companyName"
                onChange={handleChange}
                value={formData.companyName}
                type="text"
                placeholder="Enter company name"
              />
            </div>
            <div className="input">
              <label name="jobName">Job Name</label>
              <input
                name="jobName"
                onChange={handleChange}
                value={formData.jobName}
                type="text"
                placeholder="Enter job name"
              />
            </div>
            <div className="input">
              <label htmlFor="jobCategory">Job Category</label>
              <select
                name="jobCategory"
                value={formData.jobCategory}
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
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                name="jobDescription"
                onChange={handleChange}
                value={formData.jobDescription}
                placeholder="Enter job description"
              />
            </div>
            <div className="input">
              <label name="endTime">Last Date For Time</label>
              <input
                name="endTime"
                onChange={handleChange}
                value={formData.endTime}
                type="datetime-local"
                placeholder="Enter ending time"
              />
            </div>
            <div className="input">
              <label name="jobSalary">Job Salary</label>
              <input
                name="jobSalary"
                onChange={handleChange}
                value={formData.jobSalary}
                type="number"
                placeholder="Enter job salary $"
              />
            </div>
            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
