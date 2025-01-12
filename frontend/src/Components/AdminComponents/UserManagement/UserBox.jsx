import React from "react";
import { Link } from "react-router-dom";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserBox({
  id,
  name,
  picture,
  email,
  mobileNo,
  address,
  gender,
  date_of_birth,
  refreshUsers,
}) {
  const navigate = useNavigate();
  const [deleteBoxActive, setDeleteBoxActive] = useState(false);

  function handleDeleteProfile() {
    axios
      .delete(`http://localhost:3000/admin/user-management/delete/${id}`)
      .then((response) => {
        alert(response.data.message);
        refreshUsers();
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "An error occurred while deleting the user"
        );
      });
  }

  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  return (
    <div className="participant">
      <div className="participantDetailsContainer">
        <div className="profilePicture profilePictureBig">
          <img src={picture ? picture : dp} alt="Profile" />
        </div>
        <div className="participantDetails center">
          <div className="name">Name: {name}</div>
          <div>Gender: {gender}</div>
          <div>Date of birth: {getDate(date_of_birth)}</div>
        </div>
        <div className="participantDetails center">
          <div>Email: {email}</div>
          <div>Mobile no: {mobileNo}</div>
          <div>Address: {address}</div>
        </div>
      </div>

      {/* Dialogbox for delete confirmation */}
      <div className={deleteBoxActive ? "dialogBoxBackground" : "none"}>
        <div className="dialogBox">
          <div className="title">Delete Account</div>
          <div className="details">
            Do you want to delete this user permanently?
          </div>
          <div className="buttonContainer">
            <div className="button" onClick={handleDeleteProfile}>
              Yes
            </div>
            <div
              className="buttonAlt"
              onClick={() => {
                setDeleteBoxActive(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>


      <div className="buttonContainer">
        {id[0] === "S" && (
          <Link
            to={`/user-management/give-reward/${id}`}
            className="defaultButton"
          >
            <MaterialSymbol className="icon" size={22} icon="person" />
            Give Rewards
          </Link>
        )}
        <Link to={`/profile/${id}`} className="acceptButton ">
          <MaterialSymbol className="icon" size={22} icon="person" />
          View Profile
        </Link>
        {id[0] !== "A" && (
          <div onClick={()=> {setDeleteBoxActive(true)}} className="rejectButton">
            <MaterialSymbol className="icon" size={22} icon="close" />
            Delete User
          </div>
        )}
      </div>
    </div>
  );
}
