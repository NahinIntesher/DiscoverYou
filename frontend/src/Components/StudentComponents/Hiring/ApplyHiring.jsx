import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import NotFound from "../../CommonComponents/NotFound";

export default function CreateNewCourse({ user, interests, admins }) {
  const { hiringId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantsCV: []
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    if (files.every((file) => file.type === "application/pdf")) {
      setFormData((oldFormData) => ({
        ...oldFormData,
        applicantsCV: files,
      }));
    } else {
      alert("All files should be PDFs!");
    }
  };

  const removeMedia = (index) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      applicantsCV: oldFormData.applicantsCV.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.applicantsCV.length < 1) {
      alert("Please upload your CV for apply!");
      return;
    }

    const finalData = new FormData();
    formData.applicantsCV.forEach((file, index) => {
      finalData.append(`cv`, file);
    });
    finalData.append(`hiringId`, hiringId);

    axios
      .post("http://localhost:3000/student/hirings/apply", finalData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      .then((response) => {
        console.log("Full API Response:", response.data);
        alert("You have successfully applied for the job!");
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error submitting materials:", error);
      });
  };

  return (
    <div className="mainContent">
      <Header title={"Apply Job"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Upload Your CV</div>
            <div className="addMaterialSpecial">
              <div className="input">
                <input
                  type="file"
                  name="materials"
                  multiple
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            {formData.applicantsCV.length ? (
              <div className="materialContainer">
                {formData.applicantsCV.map((file, index) => (
                  <div className="materialBox" key={index}>
                    <div className="media">
                      <MaterialSymbol
                        className="pdfIcon"
                        size={42}
                        icon="description"
                      />
                    </div>
                    <div className="textContainer">
                      <div className="name">{file.name}</div>
                      <div className="format">PDF Document</div>
                    </div>
                    <div
                      className="rejectButton"
                      onClick={() => removeMedia(index)}
                    >
                      <MaterialSymbol
                        className="icon"
                        size={22}
                        icon="delete"
                      />
                      <div className="text">Delete</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="materialContainer">
                <NotFound message="You did upload your CV!" />
              </div>
            )}
            <button>Apply For Job</button>
          </form>
        </div>
      </div>
    </div>
  );
}
