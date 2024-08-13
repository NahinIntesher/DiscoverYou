import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/HomePage";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Registration/Registration";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Contest from "./Components/Contest";
import Showcase from "./Components/Showcase";
import Community from "./Components/Community";
import Course from "./Components/Course";
import Webinar from "./Components/Webinar";
import Marketplace from "./Components/Marketplace";
import Hiring from "./Components/Hiring";
import Notification from "./Components/Notification";
import Profile from "./Components/Profile";

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [interests, setInterests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuthorized(true);
          setUser(res.data.user);
          setInterests(res.data.interests || []); // Ensure interests is an array
        } else {
          setAuthorized(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setAuthorized(false);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/logout")
      .then(() => {
        setAuthorized(false);
        setUser({});
        setInterests([]); // Clear interests on logout
        // navigate("/login"); // Uncomment if you want to redirect after logout
      })
      .catch((err) => {
        console.error("Error during logout:", err);
        alert("An error occurred during logout. Please try again.");
      });
  };

  if (loaded) {
    if (authorized) {
      return (
        <BrowserRouter>
          <div className="container">
            <Sidebar
              logoutAction={handleLogout}
              user={user}
              interests={interests}
            />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/community" element={<Community />} />
              <Route path="/course" element={<Course />} />
              <Route path="/webinar" element={<Webinar />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/hiring" element={<Hiring />} />
              <Route path="/notification" element={<Notification />} />
              <Route
                path="/profile"
                element={<Profile user={user} interests={interests} />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <Routes>
            <Route
              path="*"
              element={
                <Login setAuthorized={setAuthorized} setUser={setUser} />
              }
            />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </BrowserRouter>
      );
    }
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
