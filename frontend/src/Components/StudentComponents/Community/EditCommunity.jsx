import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function EditCommunity() {
  const navigate = useNavigate();
  const { communityId } = useParams();

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

  const [communities, setcommunities] = useState({});
  const [formData, setFormData] = useState({
    communityName: "",
    communityDescription: "",
    communityCategory: [],
  });

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/student/communitiess/${communityId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const communitiesData = res.data?.communities;
          setcommunities(communitiesData);

          setFormData({
            communityName: communitiesData.community_name || "",
            communityDescription: communitiesData.community_description || "",
            communityCategory: communitiesData.community_category || [],
          });
        } else {
          alert("community not found!");
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
      [name]: name === "communityCategory" ? [value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:3000/student/communities/update/${communityId}`, {
        communityId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`Community "${formData.communityName}" successfully edited!`);
          navigate("/community/pending");
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
      <Header title={"Edit community"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Edit Your community</div>
            <div className="input">
              <label name="communityName">Community Name</label>
              <input
                name="communityName"
                onChange={handleChange}
                type="text"
                value={formData.communityName}
                placeholder="Enter community name"
              />
            </div>
            <div className="input">
              <label htmlFor="communityCategory">Community Category</label>
              <select
                name="communityCategory"
                value={formData.communityCategory}
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
              <label htmlFor="communityDescription">
                Community Description
              </label>
              <textarea
                name="communityDescription"
                onChange={handleChange}
                value={formData.communityDescription}
                placeholder="Enter community description"
              />
            </div>
            <button>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
