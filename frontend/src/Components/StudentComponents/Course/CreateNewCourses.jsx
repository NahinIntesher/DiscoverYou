import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import NotFound from "../../CommonComponents/NotFound";

export default function CreateNewCourse({ user, interests, admins }) {
  const navigate = useNavigate();
  const [durations, setDurations] = useState({});

  const [formData, setFormData] = useState({
    courseName: "",
    courseCategory: interests[0],
    courseDescription: "",
    courseMaterials: [],
    courseMaterialNames: [],
    tempMaterial: "",
    tempMaterialName: ""
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
  function removeMedia(index) {;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        courseMaterials: oldFormData.courseMaterials.filter(
          (_, i) => i !== index
        ),
        courseMaterialNames: oldFormData.courseMaterialNames.filter(
          (_, i) => i !== index
        )
      };
    }); 
  }

  const addMaterial = () => {
    if(formData.tempMaterial != "" && formData.tempMaterialName != "") {
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
    else {
      alert("You did not add any material!")
    }
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


    if (formData.courseMaterials.length < 3) {
      alert("Add at least 3 course materials!");
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
          {
            admins.map((admin) => {
              axios
                .post("http://localhost:3000/admin/notifications", {
                  recipientId: admin.admin_id,
                  notificationPicture: user.student_picture,
                  notificationTitle: "Course Creation",
                  notificationMessage: `${user.student_name} have created a new course are in pending!`,
                  notificationLink: `/course`,
                })
                .then((res) => {
                  if (res.data.status === "Success") {
                    console.log("Successfully notification send");
                  } else {
                    alert(res.data.Error);
                  }
                })
                .catch((err) => console.log(err));
            });
          }
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
            
            <div className="addMaterialSpecial">
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
                  Material File 
                </label>
                <input
                  type="file"
                  name="materials"
                  multiple
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="addButton" onClick={addMaterial} style={{cursor: "default"}}>Add</div>              
            </div>
            {formData.courseMaterials.length ?
              <div className="materialContainer">
                {formData.courseMaterials.map(function (file, index) {
                  if (file.type.split("/")[0] == "image") {
                    return (
                      <div className="materialBox" key={index}>
                        <div className="media">
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`preview ${index}`}
                          />
                        </div>
                        <div className="textContainer">
                          <div className="name">{formData.courseMaterialNames[index]}</div>
                          <div className="format">Image</div>
                        </div>
                        <div className="rejectButton" onClick={()=> removeMedia(index)}>
                          <MaterialSymbol className="icon" size={22} icon="delete" />
                          <div className="text">Delete</div>
                        </div>
                      </div>
                    );
                  } else if (file.type.split("/")[0] == "audio") {
                    return (
                      <div className="materialBox" key={index}>
                        <div className="media">
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
                        </div>
                        <div className="textContainer">
                          <div className="name">{formData.courseMaterialNames[index]}</div>
                          <div className="format">Audio</div>
                        </div>
                        <div className="rejectButton" onClick={()=> removeMedia(index)}>
                          <MaterialSymbol className="icon" size={22} icon="delete" />
                          <div className="text">Delete</div>
                        </div>
                      </div>
                    );
                  } else if (file.type.split("/")[0] == "video") {
                    return (
                      <div className="materialBox" key={index}>
                        <div className="media">
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
                        </div>
                        <div className="textContainer">
                          <div className="name">{formData.courseMaterialNames[index]}</div>
                          <div className="format">Video</div>
                        </div>
                        <div className="rejectButton" onClick={()=> removeMedia(index)}>
                          <MaterialSymbol className="icon" size={22} icon="delete" />
                          <div className="text">Delete</div>
                        </div>
                      </div>
                    );
                  } else if (file.type.split("/")[0] == "application") {
                    return (
                      <div className="materialBox" key={index}>
                        <div className="media">
                          <MaterialSymbol
                            className="pdfIcon"
                            size={42}
                            icon="description"
                          />
                        </div>
                        <div className="textContainer">
                          <div className="name">{formData.courseMaterialNames[index]}</div>
                          <div className="format">PDF Document</div>
                        </div>
                        <div className="rejectButton" onClick={()=> removeMedia(index)}>
                          <MaterialSymbol className="icon" size={22} icon="delete" />
                          <div className="text">Delete</div>
                        </div>
                      </div>
                    );
                  }
                })}
                {formData.courseMaterials.length < 3 && (
                  <p className="bottomRequired">
                    Add at least 3 materials of you course
                  </p>
                )}
              </div>
              : <div className="materialContainer">
                <NotFound message="You did not add any material!"/>
                </div>
            }
            <button>Submit For Approval</button>
          </form>
        </div>
      </div>
    </div>
  );
}
