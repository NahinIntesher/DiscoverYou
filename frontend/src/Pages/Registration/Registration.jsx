import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function AdminRegistrationPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    category: "",
    adminKey: "",
    interests: [],
    email: "",
    password: "",
    confirmPassword: "",
    // profilePicture: null,
  });
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const toggleAdminKeyVisibility = () => {
    setShowAdminKey(!showAdminKey);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  // Validation Functions
  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateAdminKey = (adminKey) => adminKey.length === 4;
  const validateMobileNumber = (phone) => /^\d{11}$/.test(phone);
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
    // Name validation
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must contain only letters and be between 1 and 30 characters long.";
    }
    // Mobile number validation
    if (!validateMobileNumber(formData.phone)) {
      newErrors.phone =
        "Please enter a valid mobile number with exactly 11 digits.";
    }
    // Admin Key validation
    if (formData.category === "admin" && !validateAdminKey(formData.adminKey)) {
      newErrors.adminKey = "Admin Key must be exactly 4 characters long.";
    }
    // Password validation
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be between 8 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
    }
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    axios.defaults.withCredentials = true;
    // If no errors, proceed to submit the form

    // if (Object.keys(newErrors).length === 0) {
    console.log(formData);
    axios
      .post("http://localhost:3000/registrationPage", formData)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/login"); // Redirect to Home page
        } else {
          alert(res.data.Error);
        }
      })
      .then((err) => console.log(err));
    // }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#ffe79a] p-5 text-white font-popins">
      <form
        onSubmit={handleSubmit}
        className="bg-[#feffdf] p-8 rounded-lg shadow-2xl w-full max-w-full sm:max-w-xl lg:max-w-3xl text-black"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center">
          Registration Form
        </h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            maxLength={50}
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-400 rounded-lg mb-1 bg-[#feffdf] placeholder-gray-500 ${
              errors.name ? "border-red-500" : ""
            }`}
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/* Birth Date */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf]"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            <label htmlFor="genderMale" className="flex items-center">
              <input
                type="radio"
                id="genderMale"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                className="form-radio"
                required
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
                onChange={handleChange}
                className="form-radio"
                required
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
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf]"
            rows="4"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Your Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded bg-[#feffdf]"
            required
          >
            <option value="">Select your category</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        {/* Admin Key */}
        {formData.category === "admin" && (
          <div className="mb-5 relative">
            <label
              htmlFor="adminKey"
              className="block text-gray-700 text-lg font-semibold"
            >
              Admin Key <span className="text-red-500">*</span>
            </label>
            <input
              type= {showAdminKey ? 'text' : "password"}
              id="adminKey"
              name="adminKey"
              placeholder="••••••••"
              value={formData.adminKey}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf] ${
                errors.adminKey ? "border-red-500" : ""
              }`}
              minLength="4"
              maxLength="4"
              required
              title="Enter a valid Admin key (8 characters)."
            />
            {errors.adminKey && (
              <p className="text-red-500 mt-1">{errors.adminKey}</p>
            )}
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={toggleAdminKeyVisibility}
            >
              {showAdminKey ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        )}

        {/* Interests */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Interests <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              "Coding Problem Solving",
              "Web/App Designing",
              "Gaming",
              "Photography",
              "Debating",
              "Singing",
              "Writing",
              "Art & Craft",
              "Graphics Designing",
            ].map((interest) => (
              <label
                key={interest}
                htmlFor={interest.toLowerCase()}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  id={interest.toLowerCase()}
                  name="interests"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={(e) => {
                    const updatedInterests = formData.interests.includes(
                      e.target.value
                    )
                      ? formData.interests.filter((i) => i !== e.target.value)
                      : formData.interests.length < 3
                      ? [...formData.interests, e.target.value]
                      : formData.interests;

                    setFormData({ ...formData, interests: updatedInterests });
                  }}
                  className="form-checkbox"
                  disabled={
                    !formData.interests.includes(interest) &&
                    formData.interests.length >= 3
                  }
                />
                <span className="ml-2">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="01XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf] ${
              errors.phone ? "border-red-500" : ""
            }`}
            required
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
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
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf]"
            // required
          />
        </div> */}

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g., youremail@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf] ${
              errors.email ? "border-red-500" : ""
            }`}
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-black">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="•••••••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border text-black border-gray-400 rounded-lg bg-[#feffdf] mt-1"
            required
          />
          <div
            className="absolute right-3 top-11 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-lg font-semibold">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-400 rounded-lg bg-[#feffdf] ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            required
          />
          <div
            className="absolute right-3 top-11 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-600 hover:text-yellow-700 font-semibold hover:underline"
            >
              Go to Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
