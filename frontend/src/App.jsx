import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Registration/Registration";
import "./App.css";
import StudentRoutes from "./Routes/StudentRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import OrganizerRoutes from "./Routes/OrganizerRoutes";

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
      if (user.type == "student") {
        return <StudentRoutes handleLogout={handleLogout} user={user} setUser={setUser} setAuthorized={setAuthorized}/>;
      } else if (user.type == "organizer") {
        return <OrganizerRoutes handleLogout={handleLogout} user={user} setUser={setUser} setAuthorized={setAuthorized}/>;
      } else if (user.type == "admin") {
        return <AdminRoutes handleLogout={handleLogout} user={user} setUser={setUser} setAuthorized={setAuthorized}/>;
      }
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
