import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Registration/Registration";
import "./App.css";
import Student from "./Routes/Student";

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
      if(user.category == "student") {
        return(
          <Student
            handleLogout={handleLogout}
            user={user}
          />
        );
      }
      else if(user.category == "organizer") {
        return(
          <Student
            handleLogout={handleLogout}
            user={user}
          />
        );
      }
      else if(user.category == "admin") {
        return(
          <Student
            handleLogout={handleLogout}
            user={user}
          />
        );
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
