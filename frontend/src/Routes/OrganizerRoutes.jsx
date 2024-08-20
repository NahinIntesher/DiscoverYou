import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Dashboard from "../Components/OrganizerComponents/Dashboard";
import Contest from "../Components/OrganizerComponents/Contest";
import Showcase from "../Components/OrganizerComponents/Showcase";
import Community from "../Components/OrganizerComponents/Community";
import Course from "../Components/OrganizerComponents/Course";
import Webinar from "../Components/OrganizerComponents/Webinar";
import Marketplace from "../Components/OrganizerComponents/Marketplace";
import Hiring from "../Components/OrganizerComponents/Hiring";
import Notification from "../Components/OrganizerComponents/Notification";
import Profile from "../Components/OrganizerComponents/Profile";

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