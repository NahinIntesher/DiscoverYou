import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function EditContest() {
  const navigate = useNavigate();
  const { contestId } = useParams();

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

  const [contests, setContests] = useState({});
  const [formData, setFormData] = useState({
    contestName: "",
    contestDetails: "",
    contestCategory: [],
  });

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/organizer/contestss/${contestId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const contestsData = res.data?.contests;
          setContests(contestsData);

          setFormData({
            contestName: contestsData.contest_name || "",
            contestDetails: contestsData.contest_details || "",
            contestCategory: contestsData.contest_category || [],
          });
        } else {
          alert("contest not found!");
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
      [name]: name === "contestCategory" ? [value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:3000/organizer/contests/update/${contestId}`, {
        contestId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`contest "${formData.contestName}" successfully edited!`);
          navigate("/contest/pending");
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
      <Header title={"Edit Contest"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Edit Your Contest</div>
            <div className="input">
              <label name="contestName">Contest Name</label>
              <input
                name="contestName"
                onChange={handleChange}
                type="text"
                value={formData.contestName}
                placeholder="Enter contest name"
              />
            </div>
            <div className="input">
              <label htmlFor="contestCategory">Contest Category</label>
              <select
                name="contestCategory"
                value={formData.contestCategory}
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
              <label htmlFor="contestDetails">Contest Details</label>
              <textarea
                name="contestDetails"
                onChange={handleChange}
                value={formData.contestDetails}
                placeholder="Enter contest description"
              />
            </div>
            <button>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
