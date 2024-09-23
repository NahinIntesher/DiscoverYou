import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "../../../assets/styles/Profile.css";

export default function UpdateProfile({ user }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: user.admin_name,
    date_of_birth: extractDate(user.admin_date_of_birth),
    gender: user.admin_gender,
    address: user.admin_address,
    mobile_no: user.admin_mobile_no,
    email: user.admin_email
  });

  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateMobileNumber = (mobile_no) => /^\d{11}$/.test(mobile_no);
  const validateEmail = (email) =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    return;
    const newErrors = {};
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must contain only letters and be between 1 and 30 characters long.";
    }
    if (!validateMobileNumber(formData.mobile_no)) {
      newErrors.mobile_no =
        "Please enter a valid mobile number with exactly 11 digits.";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    // console.log(newErrors);
    axios.defaults.withCredentials = true;
    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      navigate(-1);
      // axios
      //   .post("http://localhost:3000/organizer/profile/update", formData)
      //   .then((res) => {
      //     if (res.data.status === "Success") {
      //       console.log("Profile Update Success!");
      //     } else {
      //       alert(res.data.Error);
      //     }
      //   })
      //   .catch((err) => console.log(err));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(function(prevFormData){
      return { 
        ...prevFormData, 
        [name]: value 
      }
    });
  };

  return (
    <div className="mainContent">
      <Header title="Update Profile" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Update Your Profile</div>
            {/* Name */}
            <div className="input">
              <label>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                maxLength={50}
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            {/* Birth Date */}
            <div className="input">
              <label htmlFor="date_of_birth">
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </div>

            {/* Gender
            <div className="input">
              <label>
                Gender
              </label>
              <div className="inputRadio">
                <label htmlFor="gender">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={handleInputChange}
                    checked={formData.gender == "Male"}
                  />
                  <span className="radioLabel">Male</span>
                  
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={handleInputChange}
                    checked={formData.gender == "Female"}
                  />
                  <span className="radioLabel">Female</span>
                </label>
              </div>
            </div> */}

            {/* Address */}
            <div className="input">
              <label>
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="e.g., Mirpur-10, Mirpur, Dhaka-1216"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Mobile Number */}
            <div className="input">
              <label>
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile_no"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleInputChange}
              />
              {errors.mobile_no && (
                <p className="error">{errors.mobile_no}</p>
              )}
            </div>

            {/* Profile Picture */}
            {/* <div className="input">
            <label>
              Profile Picture
              
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-400 rounded-lg 
              // required
            />
          </div> */}

            {/* Email */}
            <div className="input">
              <label>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <button>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}