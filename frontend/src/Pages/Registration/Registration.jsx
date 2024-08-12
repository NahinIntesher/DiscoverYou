import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminRegistrationPage() {
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
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  // Validation Functions
  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateAdminKey = (adminKey) => adminKey.length === 8;
  const validateMobileNumber = (phone) => /^\d{11}$/.test(phone);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,36}$/.test(
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
      newErrors.adminKey = "Admin Key must be exactly 8 characters long.";
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be between 10 and 36 characters long, containing an uppercase letter, a lowercase letter, a digit, and a special character.";
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

    // If no errors, proceed to submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log("Successfully submitted");
      console.log("Submitted Data:", formData);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-yellow-100 p-5 text-white font-popins">
      <form
        onSubmit={handleSubmit}
        className="bg-green-50 p-8 rounded-lg shadow-2xl w-full max-w-full sm:max-w-xl lg:max-w-3xl text-black"
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
            maxLength={30}
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg mb-1 bg-gray-100 placeholder-gray-500 ${
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
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
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
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="e.g., Mirpur-10, Mirpur, Dhaka-1216"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            rows="4"
            required
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
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
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
          <div className="mb-5">
            <label
              htmlFor="adminKey"
              className="block text-gray-700 text-lg font-semibold"
            >
              Admin Key <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="adminKey"
              name="adminKey"
              placeholder="••••••••"
              value={formData.adminKey}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ${
                errors.adminKey ? "border-red-500" : ""
              }`}
              minLength="8"
              maxLength="8"
              required
              title="Enter a valid Admin key (8 characters)."
            />
            {errors.adminKey && (
              <p className="text-red-500 mt-1">{errors.adminKey}</p>
            )}
          </div>
        )}

        {/* Interests */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Interests <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["Reading", "Writing", "Traveling"].map((interest) => (
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
                      : [...formData.interests, e.target.value];
                    setFormData({ ...formData, interests: updatedInterests });
                  }}
                  className="form-checkbox"
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
            placeholder="+8801XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ${
              errors.phone ? "border-red-500" : ""
            }`}
            required
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        {/* Profile Picture */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Profile Picture
            {/* <span className="text-red-500">*</span> */}
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            // required
          />
        </div>

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
            className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ${
              errors.email ? "border-red-500" : ""
            }`}
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ${
              errors.password ? "border-red-500" : ""
            }`}
            required
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block text-gray-700 text-lg font-semibold">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}
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
