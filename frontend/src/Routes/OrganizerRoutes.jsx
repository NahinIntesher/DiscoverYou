import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../src/Components/OrganizerComponents/Sidebar";
import Dashboard from "../Components/OrganizerComponents/Dashboard";

import Contest from "../Components/OrganizerComponents/Contest/Contest";
import SingleContest from "../Components/StudentComponents/Contest/SingleContest";

import Showcase from "../Components/OrganizerComponents/Showcase/Showcase";
import Community from "../Components/OrganizerComponents/Community";
import Course from "../Components/OrganizerComponents/Course";
import Webinar from "../Components/OrganizerComponents/Webinar/Webinar";
import Marketplace from "../Components/OrganizerComponents/Marketplace";
import Hiring from "../Components/OrganizerComponents/Hiring";
import Notification from "../Components/OrganizerComponents/Notification";
import Profile from "../Components/OrganizerComponents/Profile";

export default function Student({ handleLogout, user }) {
  return (
    <BrowserRouter>
      <div className="container" data-theme={user.type}>
        <Sidebar logoutAction={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/showcase" element={<Showcase user={user} />} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />

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
