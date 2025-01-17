import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import NotFound from "../../CommonComponents/NotFound";

export default function CreateNewCourse({ user, interests, admins }) {
  const { hiringId } = useParams();
  const navigate = useNavigate();
  const [durations, setDurations] = useState({});
  const [formData, setFormData] = useState({
    applicantsCV: [],
    tempMaterial: [],
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    if (files.every((file) => file.type === "application/pdf")) {
      setFormData((oldFormData) => ({
        ...oldFormData,
        tempMaterial: files,
      }));
    } else {
      alert("All files should be PDFs!");
    }
  };

  const addMaterial = () => {
    if (formData.tempMaterial.length > 0) {
      setFormData((oldFormData) => ({
        ...oldFormData,
        applicantsCV: [...oldFormData.applicantsCV, ...formData.tempMaterial],
        tempMaterial: [],
      }));
    } else {
      alert("No CV files added!");
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
      alert("Add at least 1 course material!");
      return;
    }

    const finalData = new FormData();
    formData.applicantsCV.forEach((file, index) => {
      finalData.append(`applicantsCV[${index}]`, file);
    });

    axios
      .post("http://localhost:3000/student/hirings/apply", {
        finalData,
        hiringId: hiringId,
      })
      .then((response) => {
        console.log("Full API Response:", response.data);
        navigate("/hiring/" + hiringId);
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
            <div className="title">Drop Your CV to Apply for this job</div>
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
              <div
                className="addButton"
                onClick={addMaterial}
                style={{ cursor: "default" }}
              >
                Add
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
                <NotFound message="You did not add any material!" />
              </div>
            )}
            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
