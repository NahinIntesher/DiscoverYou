import React, { useState } from "react";
import { Edit2, Save } from "lucide-react";
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
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    }
  
    const parts = dateString.split("/");
    if (parts.length === 3) {
      // Convert from DD/MM/YYYY to YYYY-MM-DD
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  
    return "";
  };
  
  const [formData, setFormData] = useState({
    name: user.organizer_name,
    date_of_birth: extractDate(user.organizer_date_of_birth),
    gender: user.organizer_gender,
    address: user.organizer_address,
    mobile_no: user.organizer_mobile_no,
    email: user.organizer_email,
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
  const handleUpdateProfile = (e) => {
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
      <Header title={"Update your profile"} />
      <div className="p-6">{renderInputFields()}</div>
    </div>
  );
  function renderInputFields() {
    return (
      <div className="space-y-4">
        {/* Name */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength={50}
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border border-gray-400 rounded-lg mb-1${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/* Birth Date */}
        <div className="mb-5">
          <label
            htmlFor="date_of_birth"
            className="block text-gray-700 text-lg font-semibold"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-400 rounded-lg"
          />
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
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
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="e.g., Mirpur-10, Mirpur, Dhaka-1216"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-400 rounded-lg "
            rows="4"
          />
        </div>

        {/* Mobile Number */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile_no"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleInputChange}
            className={`w-full p-3 border border-gray-400 rounded-lg${
              errors.mobile_no ? "border-red-500" : ""
            }`}
          />
          {errors.mobile_no && (
            <p className="text-red-500">{errors.mobile_no}</p>
          )}
        </div>

        {/* Profile Picture */}
        {/* <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
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
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 border border-gray-400 rounded-lg ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Old Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-lg font-semibold">
            Old Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="oldPassword"
            placeholder="•••••••••••••"
            onChange={handleInputChange}
            className="w-full p-3 border text-black border-gray-400 rounded-lg mt-1"
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
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-lg font-semibold">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="•••••••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 border border-gray-400 rounded-lg ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
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
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-lg font-semibold">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-3 border border-gray-400 rounded-lg ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
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
        <div className="flex justify-end">
          <button
            onClick={handleUpdateProfile}
            className=" bg-purple-500 text-white font-bold p-3 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}