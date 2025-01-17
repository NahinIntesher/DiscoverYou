import React from "react";
import dp from "../../../assets/images/default.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingCommunityBox({
  id,
  name,
  category,
  description,
  adminName,
  adminId,
  setUpdate,
}) {
  function handleDelete() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/community/delete", {
        communityId: id,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Community "' + name + '" has been deleted.');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="pendingCommunityBox">
      <div className="communityDetails">
        <div className="informationContainer">
          <div className="information">
            <div className="title">{name}</div>
            <div className="category">
              {category === "Competitive Programming" && (
                <MaterialSymbol className="icon" size={24} icon="code" />
              )}
              {category === "Singing" && (
                <MaterialSymbol className="icon" size={24} icon="queue_music" />
              )}
              {category === "Graphics Designing" && (
                <MaterialSymbol className="icon" size={24} icon="polyline" />
              )}
              {category === "Photography" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="photo_camera"
                />
              )}
              {category === "Web/App Designing" && (
                <MaterialSymbol className="icon" size={24} icon="web" />
              )}
              {category === "Writing" && (
                <MaterialSymbol className="icon" size={24} icon="edit_note" />
              )}
              {category === "Art & Craft" && (
                <MaterialSymbol className="icon" size={24} icon="draw" />
              )}
              {category === "Debating" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="communication"
                />
              )}
              {category === "Gaming" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="sports_esports"
                />
              )}
              <div className="text">{category}</div>
            </div>
          </div>
        </div>
        <div className="description">
          <div className="detail">{description}</div>
        </div>
      </div>
      <div className="buttonContainer">
        <Link to={'edit/' + id} className="defaultButton">
          <MaterialSymbol className="icon" size={22} icon="edit" />
          <div className="text">Edit Details</div>
        </Link>
        <div className="rejectButton" onClick={handleDelete}>
          <MaterialSymbol className="icon" size={22} icon="delete" />
          <div className="text">Delete</div>
        </div>
      </div>
    </div>
  );
}
