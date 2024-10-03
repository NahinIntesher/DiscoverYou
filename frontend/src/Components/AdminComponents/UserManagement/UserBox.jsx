import React from "react";
import { Link } from "react-router-dom";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserBox({
  id,
  name,
  picture,
  email,
  mobileNo,
  address,
  gender,
  date_of_birth,
  refreshUsers 
}) {
  const navigate = useNavigate();

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
        <div>
          <div className="profilePicture">
            <img src={picture ? picture : dp} alt="Profile" />
          </div>
        </div>
        <div className="participantDetailsSmallContainer">
          <div className="participantDetails">
            <div className="name">Name: {name}</div>
            <div>Gender: {gender}</div>
            <div>Date of birth: {getDate(date_of_birth)}</div>
          </div>
          <div className="participantDetails">
            <div>Email: {email}</div>
            <div>Mobile no: {mobileNo}</div>
            <div>Address: {address}</div>
          </div>
          <div className="participantDetails">
            <div>
              <Link to={`/profile/${id}`} className="acceptButton">
                <MaterialSymbol className="icon" size={22} icon="person" />
                View Profile
              </Link>
            </div>
            {id[0] !== "A" && (
              <div onClick={handleDeleteProfile} className="rejectButton">
                <MaterialSymbol className="icon" size={22} icon="close" />
                Delete User
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
