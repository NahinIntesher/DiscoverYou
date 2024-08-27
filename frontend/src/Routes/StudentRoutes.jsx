import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Dashboard from "../Components/StudentComponents/Dashboard";

import Contest from "../Components/StudentComponents/Contest/Contest";
import SingleContest from "../Components/StudentComponents/Contest/SingleContest";

import Showcase from "../Components/StudentComponents/Showcase/Showcase";
import Post from "../Components/StudentComponents/Showcase/Post";


import Course from "../Components/StudentComponents/Course";
import Webinar from "../Components/StudentComponents/Webiner/Webiner";
import Marketplace from "../Components/StudentComponents/Marketplace";
import Hiring from "../Components/StudentComponents/Hiring";
import Notification from "../Components/StudentComponents/Notification";
import Profile from "../Components/StudentComponents/Profile";
import Community from "../Components/StudentComponents/Community/Community";
import CreateNewCommunity from "../Components/StudentComponents/Community/CreateNewCommunity";
import SingleCommunity from "../Components/StudentComponents/Community/SingleCommunity";

export default function Student({ handleLogout, user }) {
  return (
    <BrowserRouter>
      <div className="container">
        <Sidebar logoutAction={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/showcase" element={<Showcase user={user} />} />
          <Route path="/showcase/post/:postId" element={<Post />} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />

          <Route path="/community" element={<Community/>} />
          <Route path="/community/new" element={<CreateNewCommunity interests={user.interests} />} />
          <Route path="/community/:communityId" element={<SingleCommunity />} />

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
