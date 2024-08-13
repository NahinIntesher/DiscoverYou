import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/HomePage"; // Make sure to import the Home component
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
import Profile from "./Components/Profile";

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState("");
  const [loaded, setLoaded] = useState(false);
//  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3000/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuthorized(true);
          console.log(res.data.user)
          setUser(res.data.user);
        } else {
          setAuthorized(false);
        }
        setLoaded(true);
      })
      .then((err) => {
        if(err) throw err;
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/logout") // Replace with your actual logout endpoint
      .then(() => {
        setAuthorized(false);
        setUser("");
//        navigate("/login"); // Redirect to login page
      })
      .catch((err) => {
        if(err) throw err;

        alert("An error occurred during logout. Please try again.");
      });
  };

  if(loaded) {
    if(authorized) {
      return (
        <BrowserRouter>
            <div className="container">
              <Sidebar logoutAction={handleLogout} user={user}/>
              <Routes>
                  <Route path="/" element={<Dashboard/>} />
                  <Route path="/showcase" element={<Showcase/>} />
                  <Route path="/contest" element={<Contest/>} />
                  <Route path="/community" element={<Community/>} />
                  <Route path="/course" element={<Course/>} />
                  <Route path="/webinar" element={<Webinar/>} />
                  <Route path="/marketplace" element={<Marketplace/>} />
                  <Route path="/hiring" element={<Hiring/>} />
                  <Route path="/notifiction" element={<Notification/>} />
                  <Route path="/profile" element={<Profile/>} />
              </Routes>
            </div>
        </BrowserRouter>
      ); 
    } else {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Login setAuthorized={setAuthorized} setUser={setUser}/>} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
}

export default App;
