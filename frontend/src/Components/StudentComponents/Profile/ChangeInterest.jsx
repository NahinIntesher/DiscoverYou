import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "../../../assets/styles/Profile.css";

export default function ChangeInterest({ user, setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interests: user.interests,
  });

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

  const addInterest = (newInterest) => {
    if(formData.interests.length >= 3) {
      alert("You can select maximum 3 interests!")
    }
    else {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
    }
  }

  const removeInterest = (removedInterest) => {
    if(formData.interests.length <= 1) {
      alert("You should select atleast one interests!")
    }
    else {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== removedInterest),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/student/profile/settings/change-interests", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            navigate(-1);
            setUser({
                ...user,
                interests: formData.interests
            });
            alert("Interests Updated Successfully!");
          } else {
            alert('Can not update interests!');
          }
        })
        .catch((err) => console.log(err));
  };

  return (
    <div className="mainContent">
      <Header title="Change Interests" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Change Your Interests</div>
            {/* Interests */}
            <div className="input">
              <div className="label">My Interests</div>
              {formData.interests.map((interest) => (
                <SelectedInterest category={interest} removeInterest={removeInterest}/>
              ))}
            </div>
            <div className="smallBreak"/>
            <div className="input">
              <div className="label">Available Interests</div>
              {allInterests.filter((interest)=>{return !formData.interests.includes(interest)}).map((interest) => (
                <Interest category={interest} addInterest={addInterest}/>
              ))}
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}


function SelectedInterest({ category, removeInterest}) {
  return (
    <div className="userInterest">
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
        <MaterialSymbol className="icon" size={24} icon="photo_camera" />
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
        <MaterialSymbol className="icon" size={24} icon="communication" />
      )}
      {category === "Gaming" && (
        <MaterialSymbol className="icon" size={24} icon="sports_esports" />
      )}
      <div className="text">{category}</div>
      <div className="remove" onClick={function(){removeInterest(category)}}>
        <MaterialSymbol className="icon" size={22} icon="close" />
      </div>
    </div>
  );
}
function Interest({ category, addInterest }) {
  return (
    <div onClick={function(){addInterest(category)}} className="userInterest unselectedInterest">
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
        <MaterialSymbol className="icon" size={24} icon="photo_camera" />
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
        <MaterialSymbol className="icon" size={24} icon="communication" />
      )}
      {category === "Gaming" && (
        <MaterialSymbol className="icon" size={24} icon="sports_esports" />
      )}
      <div className="text">{category}</div>
    </div>
  );
}