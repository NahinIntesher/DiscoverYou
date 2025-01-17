import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function EditWebinar() {
  const navigate = useNavigate();
  const { webinarId } = useParams();

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

  const [webinars, setWebinars] = useState({});
  const [formData, setFormData] = useState({
    webinarName: "",
    webinarDescription: "",
    webinarCategory: [],
    // startTime: "",
    // endTime: "",
    meetingLink: "",
  });
  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/organizer/webinarss/${webinarId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const webinarsData = res.data?.webinars;
          setWebinars(webinarsData);

          setFormData({
            webinarName: webinarsData.webinar_name || "",
            webinarDescription: webinarsData.webinar_description || "",
            webinarCategory: webinarsData.webinar_category || [],
            // startTime: extractDate(webinarsData.startTime) || "",
            // endTime: extractDate(webinarsData.end_time) || "",
            meetingLink: webinarsData.meeting_link || "",
          });
        } else {
          alert("Webinar not found!");
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
      [name]: name === "webinarCategory" ? [value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:3000/organizer/webinars/update/${webinarId}`, {
        webinarId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`Webinar "${formData.webinarName}" successfully edited!`);
          navigate("/webinar/pending");
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
      <Header title={"New Webinar"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Create New Webinar</div>
            <div className="input">
              <label name="webinarName">Webinar Name</label>
              <input
                name="webinarName"
                onChange={handleChange}
                type="text"
                value={formData.webinarName}
                placeholder="Enter webinar name"
              />
            </div>
            <div className="input">
              <label htmlFor="webinarCategory">Webinar Category</label>
              <select
                name="webinarCategory"
                value={formData.webinarCategory}
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
              <label htmlFor="webinarDescription">Webinar Description</label>
              <textarea
                name="webinarDescription"
                onChange={handleChange}
                value={formData.webinarDescription}
                placeholder="Enter webinar description"
              />
            </div>
            {/* <div className="input">
              <label name="startTime">Starting Time</label>
              <input
                name="startTime"
                onChange={handleChange}
                value={formData.startTime}
                type="datetime-local"
                placeholder="Enter webinar starting time"
              />
            </div>
            <div className="input">
              <label name="endTime">Ending Time</label>
              <input
                name="endTime"
                onChange={handleChange}
                value={formData.endTime}
                type="datetime-local"
                placeholder="Enter webinar ending time"
              />
            </div> */}
            <div className="input">
              <label name="meetingLink">Meeting Link</label>
              <input
                name="meetingLink"
                onChange={handleChange}
                value={formData.meetingLink}
                type="text"
                placeholder="Enter webinar meeting link"
              />
            </div>
            <button>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
