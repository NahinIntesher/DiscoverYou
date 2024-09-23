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
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };
  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateMobileNumber = (mobile_no) => /^\d{11}$/.test(mobile_no);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,36}$/.test(
      password
    );
  const validateEmail = (email) =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must contain only letters and be between 1 and 30 characters long.";
    }
    if (!validateMobileNumber(formData.mobile_no)) {
      newErrors.mobile_no =
        "Please enter a valid mobile number with exactly 11 digits.";
    }
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }
    if (
      formData.confirmPassword &&
      !validatePassword(formData.confirmPassword)
    ) {
      newErrors.confirmPassword =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }
    if (formData.oldPassword) {
      // if (formData.password !== formData.oldPassword) {
      //   newErrors.oldPassword = "New and old passwords do not match.";
      // }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "New and Confirm passwords do not match.";
      }
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // setErrors(newErrors);
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
    setFormData(function (prevFormData) {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  return (
    <div className="mainContent">
      <Header title="Update Profile" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Update Your Profile</div>

            {/* Old Password */}
            <div className="input">
              <label>Old Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="oldPassword"
                placeholder="•••••••••••••"
                onChange={handleInputChange}
              />
              <div
                className="absolute right-3 top-11 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <MaterialSymbol icon="visibility" size={18} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={18} />
                )}
              </div>
            </div>
            {/* New Password */}

            <div className="input">
              <label>New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="•••••••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div
                className="absolute right-3 top-11 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <MaterialSymbol icon="visibility" size={18} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={18} />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="input">
              <label>Confirm New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <div
                className="absolute right-3 top-11 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <MaterialSymbol icon="visibility" size={18} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={18} />
                )}
              </div>
            </div>
            <button className="">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
