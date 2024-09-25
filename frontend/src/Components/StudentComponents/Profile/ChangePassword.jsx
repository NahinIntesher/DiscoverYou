import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "../../../assets/styles/Profile.css";

export default function ChangePassword({ user }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showOldPassword, setOldShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const toggleOldPasswordVisibility = () => {
    setOldShowPassword(!showOldPassword);
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

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const newErrors = {};
    if (formData.oldPassword && !validatePassword(formData.oldPassword)) {
      newErrors.oldPassword =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }
    if (formData.confirmPassword && !validatePassword(formData.confirmPassword)) {
      newErrors.confirmPassword =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "New and Confirm passwords do not match.";
    }

    setErrors(newErrors);
    console.log(newErrors);
    console.log(formData);

    axios.defaults.withCredentials = true;
    if (Object.keys(newErrors).length === 0) {
      axios
        .post("http://localhost:3000/student/profile/settings/change-password", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            navigate(-1);
            alert("Password Updated Successfully!");
          } else {
            setErrors(
              {...errors, 
                serverError: res.data.Error
              });
          }
        })
        .catch((err) => console.log(err));
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
      <Header title="Change Password" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Change Your Password</div>
            {/* Old Password */}
            <div className="input">
              <label>Old Password</label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="password"
                name="oldPassword"
                placeholder="•••••••••••••"
                onChange={handleInputChange}
              />
              <div
                className="absolute right-3 top-11 cursor-pointer"
                onClick={toggleOldPasswordVisibility}
              >
                {showOldPassword ? (
                  <MaterialSymbol icon="visibility" size={18} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={18} />
                )}
              </div>
              {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}
              {errors.serverError && <p className="error">{errors.serverError}</p>}
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
              {errors.password && <p className="error">{errors.password}</p>}
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
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
