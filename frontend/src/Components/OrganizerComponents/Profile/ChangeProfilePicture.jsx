import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "../../../assets/styles/Profile.css";
import dp from "../../../assets/images/default.jpg";

export default function ChangeProfilePicture({ user, setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    images: [],
  });

  const [currentProfilePicture, setCurrentProfilePicture] = useState(user.organizer_picture ? user.organizer_picture : dp);

  const handleFileChange = (event) => {
    let mimetype = event.target.files[0].type;
    console.log(mimetype);
    if (mimetype.startsWith("image")) {
      setCurrentProfilePicture(URL.createObjectURL(event.target.files[0]));
      setFormData(function (oldFormData) {
        return {
          ...oldFormData,
          images: [...Array.from(event.target.files)],
        };
      });
    } else {
      alert("File should be image!");
    }
  };

  function removeMedia(index) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        images: prevFormData.images.filter((_, i) => i !== index),
      };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = new FormData();
    formData.images.forEach((file, index) => {
      finalData.append(`images`, file);
    });

    axios.defaults.withCredentials = true;
      console.log(formData);
      
      axios
        .post("http://localhost:3000/organizer/profile/update-profile", finalData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Profile picture Update Success!");

            setUser(function(prev){
              return {
                ...prev,
                organizer_picture: prev.organizer_picture+"?new"
              }
            });

            navigate("/profile");
          } else {
            alert("Cannot update profile!");
          }
        })
        .catch((err) => console.log(err));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (prevFormData) {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  return (
    <div className="mainContent">
      <Header title="Change Profile Picture" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Update Profile Picture</div>
            



              <div className="center">
                <div className="currentProfilePicture">
                  <img 
                    src={currentProfilePicture}
                    alt="profilePicute"
                  />
                </div>
                <div className="uploadProfilePicture">
                  <input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    required
                  />
                  Upload New Image
                </div>
              </div>
{/* 

            <div className="mediaContainer">
              {formData.images.map(function (file, index) {
                if (file.type.split("/")[0] == "image") {
                  return (
                    <div className="media" key={index}>
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                      />
                      <div
                        className="remove"
                        onClick={function () {
                          removeMedia(index);
                        }}
                      >
                        <MaterialSymbol
                          className="icon"
                          size={20}
                          icon="close"
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div> */}

            <button>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
