import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function GiveRewards({ user }) {
  // Use the correct parameter name from your route
  const { userId } = useParams();
  const navigate = useNavigate();

  const [rewardName, setRewardName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    // Update the URL to use the correct userId
    axios
      .post(
        `http://localhost:3000/admin/user-management/reward/new`,
        {
          userId: userId,
          rewardName,
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post("http://localhost:3000/student/notifications", {
              recipientId: userId,
              notificationPicture: "http://localhost:5173/images/admin.jpg",
              notificationTitle: "*************   Got Reward   *************",
              notificationMessage: `You have been given rewards for gaining gorgeous results in your previous contests!`,
              notificationLink: `/profile`,
            })
            .then((res) => {
              if (res.data.status === "Success") {
                console.log("Notification sent successfully");
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.log(err));

          navigate("/user-management");
          alert("Reward giving successfully submitted!");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mainContent">
      <Header title={"Reward Giving"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Give New Reward</div>
            <div className="input">
              <label htmlFor="rewardName">
                Reward Name <span className="required">*</span>
              </label>
              <input
                id="rewardName"
                name="rewardName"
                onChange={(e) => setRewardName(e.target.value)}
                value={rewardName}
                type="text"
                required
                placeholder="Enter Reward Name"
              />
            </div>
            <button type="submit">Give Rewards</button>
          </form>
        </div>
      </div>
    </div>
  );
}
