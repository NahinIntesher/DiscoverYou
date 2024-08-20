import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Dashboard from "../Components/AdminComponents/Dashboard";
import Contest from "../Components/AdminComponents/Contest";
import Showcase from "../Components/AdminComponents/Showcase";
import Community from "../Components/AdminComponents/Community";
import Course from "../Components/AdminComponents/Course";
import Webinar from "../Components/AdminComponents/Webinar";
import Marketplace from "../Components/AdminComponents/Marketplace";
import Hiring from "../Components/AdminComponents/Hiring";
import Notification from "../Components/AdminComponents/Notification";
import Profile from "../Components/AdminComponents/Profile";

export default function Student({handleLogout, user}) {
    return(
        <BrowserRouter>
            <div className="container">
                <Sidebar
                    logoutAction={handleLogout}
                    user={user}
                />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/showcase" element={<Showcase user={user}/>} />
                    <Route path="/contest" element={<Contest />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/course" element={<Course />} />
                    <Route path="/webinar" element={<Webinar />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/hiring" element={<Hiring />} />
                    <Route path="/notification" element={<Notification />} />
                    <Route
                    path="/profile"
                    element={<Profile user={user} />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}