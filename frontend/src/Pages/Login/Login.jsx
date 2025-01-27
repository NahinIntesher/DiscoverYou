import React, { useState } from "react";
import DiscoverYouImage from "../../assets/images/DiscoverYou.png"; // Import the image
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function LoginPage({ setAuthorized, setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    category: "student",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailPattern.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function handleCategoryChange(role) {
    setFormData({
      ...formData,
      category: role,
    });
  } 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    // if (formData.password.length < 10) {
    //   newErrors.password = "Password must be at least 10 characters long.";
    // }

    setErrors(newErrors);
    axios.defaults.withCredentials = true;
    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      axios
        .post("http://localhost:3000/login", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            setAuthorized(true);
            setUser(res.data.user);
            navigate("/");
          } else {
            alert(res.data.Error);
          }
        })
        .then((err) => console.log(err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffe79a] p-5">
      <div className="flex flex-col md:flex-row  bg-[#feffdf] rounded-md shadow-2xl overflow-hidden w-full max-w-3xl">
        {/* Picture Section */}
        <div className="w-full md:w-1/2 h-full md:h-auto relative">
          <img
            src={DiscoverYouImage}
            alt="Login Illustration"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              DiscoverYou Login
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border text-black border-gray-400 rounded-lg bg-[#feffdf] mt-1"
                required
                title="Please enter a valid email address."
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-xs">{errors.email}</p>
              )}
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
                {showPassword ? (
                  <MaterialSymbol icon="visibility" size={18} />
                ) : (
                  <MaterialSymbol icon="visibility_off" size={18} />
                )}
              </div>
            </div>

            {/* Category */}
            {/* <div className="mb-5">
              <label className="block text-gray-700 text-md">
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
            </div> */}
            <div className="mt-4 mb-2">
              <label className="block text-gray-700 text-md">
                Category 
              </label>
            </div>
            <div className="mb-4 flex justify-center space-x-4">
              {['student', 'organizer', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleCategoryChange(role)}
                  className={`p-3 w-28 rounded-lg border-2 transition duration-300 ${
                    formData.category === role
                      ? 'bg-yellow-500 text-white'
                      : 'bg-[#feffdf] text-black border-gray-400'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>



            {/* Submit Button */}
            <div className="mb-4 mt-5">
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Don't have an account?{" "}
                <span className="text-yellow-600 font-semibold hover:text-yellow-700 hover:underline">
                  <Link to="/registration">Register here</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
