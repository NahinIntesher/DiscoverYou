import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Dashboard from "../Components/StudentComponents/Dashboard";

import Contest from "../Components/StudentComponents/Contest/Contest";
import SingleContest from "../Components/StudentComponents/Contest/SingleContest";

import Showcase from "../Components/StudentComponents/Showcase";
import Community from "../Components/StudentComponents/Community";
import Course from "../Components/StudentComponents/Course";
import Webinar from "../Components/StudentComponents/Webinar";
import Marketplace from "../Components/StudentComponents/Marketplace";
import Hiring from "../Components/StudentComponents/Hiring";
import Notification from "../Components/StudentComponents/Notification";
import Profile from "../Components/StudentComponents/Profile";

export default function Student({ handleLogout, user }) {
  return (
    <BrowserRouter>
      <div className="container">
        <Sidebar logoutAction={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/showcase" element={<Showcase user={user} />} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/single-contest" element={<SingleContest />} />

          <Route path="/community" element={<Community />} />
          <Route path="/course" element={<Course />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
