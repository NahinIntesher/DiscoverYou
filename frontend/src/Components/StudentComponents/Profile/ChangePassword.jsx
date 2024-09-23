import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";

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
    name: user.student_name,
    date_of_birth: extractDate(user.student_date_of_birth),
    gender: user.student_gender,
    address: user.student_address,
    mobile_no: user.student_mobile_no,
    email: user.student_email,
    oldPassword: "",
    password: "",
    updatePassword: "",
  });

  console.log(formData);
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
      <Header title="Update Profile" />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onClick={handleSubmit}>
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

            {/* Gender */}
            <div className="input">
              <label>
                Gender
              </label>
              <div className="flex flex-wrap gap-4">
                <label htmlFor="genderMale" className="flex items-center">
                  <input
                    type="radio"
                    id="genderMale"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label htmlFor="genderFemale" className="flex items-center">
                  <input
                    type="radio"
                    id="genderFemale"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

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

            {/* Old Password */}
            <div className="input">
              <label>
                Old Password
              </label>
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
            {formData.oldPassword && (
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
            )}

            {/* Confirm Password */}
            {formData.oldPassword && (
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
            )}
            <button>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}