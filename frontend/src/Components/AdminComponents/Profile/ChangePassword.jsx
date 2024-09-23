import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    updatePassword: "",
  });

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,36}$/.test(
      password
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

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

    setErrors(newErrors);
    console.log(newErrors);
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
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mainContent">
      <Header title="Change Password" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Update Your Password</div>
            {/* Old Password */}
            <div className="input">
              <label>
                Old Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="password"
                name="oldPassword"
                placeholder="•••••••••••••"
                onChange={handleInputChange}
              />
              <div
                className="showPassword"
                onClick={toggleOldPasswordVisibility}
              >
                {showOldPassword ? (
                  <MaterialSymbol icon="visibility" size={20} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={20} />
                )}
              </div>
            </div>

            <div className="input">
              <label>
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="•••••••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div
                className="showPassword"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <MaterialSymbol icon="visibility" size={20} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={20} />
                )}
              </div>
            </div>

            <div className="input">
              <label>
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                />
              <div
                className="showPassword"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <MaterialSymbol icon="visibility" size={20} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={20} />
                )}
              </div>
            </div>
            <button>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}