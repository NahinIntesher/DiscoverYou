import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../src/Components/OrganizerComponents/Sidebar";
import Dashboard from "../Components/OrganizerComponents/Dashboard/Dashborad";

import Contest from "../Components/OrganizerComponents/Contest/Contest";
import SingleContest from "../Components/OrganizerComponents/Contest/SingleContest";

import Showcase from "../Components/OrganizerComponents/Showcase/Showcase";
import Webinar from "../Components/OrganizerComponents/Webinar/Webinar";
import Marketplace from "../Components/OrganizerComponents/Marketplace/Marketplace";
import Hiring from "../../src/Components/OrganizerComponents/Hiring/Hiring";

import Notification from "../../src/Components/OrganizerComponents/Notification/Notification";

import Profile from "../Components/OrganizerComponents/Profile/Profile";
import UpdateProfile from "../Components/OrganizerComponents/Profile/UpdateProfile";

import Post from "../Components/OrganizerComponents/Showcase/Post";

export default function Student({ handleLogout, user }) {
  return (
    <BrowserRouter>
      <div className="container" data-theme={user.type}>
        <Sidebar logoutAction={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/showcase" element={<Showcase user={user} />} />
          <Route path="/showcase/post/:postId" element={<Post />} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />

          <Route path="/webinar" element={<Webinar />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/update-profile" element={<UpdateProfile user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
