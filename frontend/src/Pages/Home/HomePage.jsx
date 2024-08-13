import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../../Components/Header/Navbar";

export default function HomePage() {
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Logged in");
          setAuthorized(true);
          setName(res.data.name);
        } else {
          setAuthorized(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/logout") // Replace with your actual logout endpoint
      .then(() => {
        setAuthorized(false);
        setName("");
        navigate("/login"); // Redirect to login page
      })
      .catch((err) => {
        console.error(err);

        alert("An error occurred during logout. Please try again.");
      });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100 font-poppins">
      {authorized ? (
        <div className="min-h-screen w-full flex flex-col bg-[#feffdf] text-black">
          {/* Navbar */}
          <Navbar handleLogout={handleLogout} />

          {/* Hero Section */}
          <section className="flex-1 flex flex-col justify-center items-center bg-custom-gradient2 py-10 sm:py-20 px-4 sm:px-8">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Welcome {name}
            </h1>
            <p className="text-base sm:text-lg mb-8">
              This is where your journey begins.
            </p>
            <Link
              to="/explore"
              className="p-2 border-2 border-gray-900 bg-white text-black rounded-lg hover:bg-black hover:border-gray-900 hover:text-white transition duration-200 text-sm sm:text-base"
            >
              Explore Now
            </Link>
            <p className="mt-8 max-w-xs sm:max-w-xl text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.
              Morbi a bibendum metus.
            </p>
          </section>

          {/* Footer */}
          <footer className="bg-gray-700 p-6 text-white">
            <div className="container mx-auto text-center">
              <p>&copy; 2023 MyApp. All rights reserved.</p>
              <div className="space-x-4 mt-2">
                <Link
                  to="/privacy"
                  className="hover:text-gray-300 transition duration-200 text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-gray-300 transition duration-200 text-sm sm:text-base"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        // <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        //   <h1 className="text-3xl font-semibold text-red-500 mb-4">
        //     Unauthorized
        //   </h1>
        //   <h3 className="text-lg mb-4">Please login to access this page.</h3>
        //   <Link
        //     to="/login"
        //     className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-700 transition duration-300"
        //   >
        //     Login
        //   </Link>
        // </div>
        navigate("/login")
      )}
    </div>
  );
}