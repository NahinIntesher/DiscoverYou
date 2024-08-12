import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Dashboard from "../../Components/Dashboard";

export default function HomePage() {
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuthorized(true);
          setUser(res.data);
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
    <div className="container">
      {authorized ? (
        <>
        <Sidebar user={user}/><Dashboard/>
        </>
        
      ) : (
        navigate("/login")
      )}
    </div>
  );
}
