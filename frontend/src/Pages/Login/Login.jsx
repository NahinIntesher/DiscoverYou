import React, { useState } from "react";
import DiscoverYouImage from "../../assets/images/DiscoverYou.png"; // Import the image
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailPattern.test(email);
  };

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
      axios
        .post("http://localhost:3000/loginPage", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            navigate("/"); // Redirect to Home page
          } else {
            alert(res.data.Error);
          }
        })
        .then((err) => console.log(err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#ffe79a]">
      <div className="flex flex-col md:flex-row h-auto md:h-3/4 bg-[#feffdf] rounded-md shadow-2xl overflow-hidden w-full max-w-3xl">
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
            <h2 className="text-3xl font-bold text-black mb-4">
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
            <div className="mb-4">
              <label htmlFor="password" className="block text-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="•••••••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border text-black border-gray-400 rounded-lg bg-[#feffdf] mt-1"
                required
              />
              {errors.password && (
                <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
              )}
            </div>
            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-black">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Forgot Password */}
              <a
                href="#"
                className="text-sm font-medium text-blue-800 hover:underline"
              >
                Forgot password?
              </a>
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
