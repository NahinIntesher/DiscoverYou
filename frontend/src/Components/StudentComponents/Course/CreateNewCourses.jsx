import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";

export default function CreateNewCourse({ interests }) {
  const navigate = useNavigate();
  const [durations, setDurations] = useState({});

  const [formData, setFormData] = useState({
    courseName: "",
    courseCategory: interests[0],
    courseDescription: "",
    courseMaterials: [],
    courseMaterialNames: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  function formatedDuration(duration) {
    return `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  const handleLoadedMetadata = (file, index, event) => {
    const duration = event.target.duration;
    setDurations((prevDurations) => ({
      ...prevDurations,
      [index]: duration,
    }));
  };

  const handleFileChange = (event) => {
    let mimetype = event.target.files[0].type;
    console.log(mimetype);
    if (
      mimetype.startsWith("image") ||
      mimetype.startsWith("video") ||
      mimetype.startsWith("audio") ||
      mimetype.startsWith("application")
    ) {
      setFormData(function (oldFormData) {
        return {
          ...oldFormData,
          tempMaterial: event.target.files,
        };
      });
    } else {
      alert("File should be image, video or audio!");
    }
  };
  function removeMedia(index) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        courseMaterials: prevFormData.courseMaterials.filter(
          (_, i) => i !== index
        ),
      };
    });
  }

  const addMaterial = () => {
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        courseMaterials: [
          ...oldFormData.courseMaterials,
          ...Array.from(oldFormData.tempMaterial),
        ],
        courseMaterialNames: [
          ...oldFormData.courseMaterialNames,
          oldFormData.tempMaterialName
        ]
      };
    });    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = new FormData();
    finalData.append("courseName", formData.courseName);
    finalData.append("courseCategory", formData.courseCategory);
    finalData.append("coursePrice", formData.coursePrice);
    finalData.append("courseDescription", formData.courseDescription);
    finalData.append("courseMaterialNames", formData.courseMaterialNames);
    formData.courseMaterials.forEach((file, index) => {
      finalData.append(`courseMaterials`, file);
    });


    if (formData.courseMaterials.length < 2) {
      alert("Add at least 5 course materials!");
      return;
    }

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/courses/new", finalData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Course Creation Success!");
          navigate(-1);
          alert("Course successfully submitted for approval!");
          //            setUpdatePost((prevData) => prevData+1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mainContent">
      <Header title={"New Course"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Create New Course</div>
            <div className="input">
              <label name="courseName">Course Name</label>
              <input
                name="courseName"
                onChange={handleChange}
                type="text"
                placeholder="Enter course name"
              />
            </div>
            <div className="input">
              <label htmlFor="courseCategory">Course Category</label>
              <select name="courseCategory" onChange={handleChange}>
                {interests.map(function (interest) {
                  return <option key={interest} value={interest}>{interest}</option>;
                })}
              </select>
            </div>
            {/* <div className="input">
              <label htmlFor="coursePrice">Course Price</label>
              <input
                name="coursePrice"
                onChange={handleChange}
                type="number"
                placeholder="Enter course price (৳)"
              />
            </div> */}
            <div className="input">
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                name="courseDescription"
                onChange={handleChange}
                placeholder="Enter course description"
              />
            </div>
            <div className="smallBreak"></div>
            <div className="title">Add Course Materials</div>
            {/* Course Materials */}
            
            <div className="input">
              <label name="tempMaterialName">Material Name</label>
              <input
                name="tempMaterialName"
                onChange={handleChange}
                type="text"
                placeholder="Enter material name"
              />
            </div>
            <div className="input">
              <label htmlFor="courseMaterials">
                Material File <span className="required">*</span>
              </label>
              <input
                type="file"
                name="materials"
                multiple
                onChange={handleFileChange}
                required
              />
              {formData.courseMaterials.length < 5 && (
                <p className="bottomRequired">
                  Add at least 5 materials of you course
                </p>
              )}
            </div>
            <div onClick={addMaterial}>Add Material</div>

            <div className="mediaContainer">
              {formData.courseMaterials.map(function (file, index) {
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
                } else if (file.type.split("/")[0] == "audio") {
                  return (
                    <div className="media" key={index}>
                      <audio
                        src={URL.createObjectURL(file)}
                        onLoadedMetadata={(event) =>
                          handleLoadedMetadata(file, index, event)
                        }
                      />
                      <MaterialSymbol className="audio" size={42} icon="mic" />
                      <div className="duration">
                        {durations[index]
                          ? formatedDuration(durations[index])
                          : "00.00"}
                      </div>
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
                } else if (file.type.split("/")[0] == "video") {
                  return (
                    <div className="media" key={index}>
                      <video
                        src={URL.createObjectURL(file)}
                        onLoadedMetadata={(event) =>
                          handleLoadedMetadata(file, index, event)
                        }
                      />
                      <MaterialSymbol
                        className="audio"
                        size={42}
                        icon="movie"
                      />
                      <div className="duration">
                        {durations[index]
                          ? formatedDuration(durations[index])
                          : "00.00"}
                      </div>
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
                } else if (file.type.split("/")[0] == "application") {
                  return (
                    <div className="media" key={index}>
                      <MaterialSymbol
                        className="icon"
                        size={42}
                        icon="insert_drive_file"
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
            </div>

            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
