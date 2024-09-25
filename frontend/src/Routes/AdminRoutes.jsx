import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../src/Components/AdminComponents/Sidebar";
import Dashboard from "../Components/AdminComponents/Dashboard/Dashborad";

import Contest from "../Components/AdminComponents/Contest/Contest";
import SingleContest from "../Components/AdminComponents/Contest/SingleContest";

import Showcase from "../Components/AdminComponents/Showcase/Showcase";
import Community from "../Components/AdminComponents/Community/Community";
import Course from "../Components/AdminComponents/Course/Course";
import Webinar from "../Components/AdminComponents/Webinar/Webinar";
import Marketplace from "../Components/AdminComponents/Marketplace/Marketplace";
import PendingProducts from "../Components/AdminComponents/Marketplace/PendingProducts";

import Hiring from "../../src/Components/AdminComponents/Hiring/Hiring";

import Notification from "../Components/AdminComponents/Notification/Notification";

import Profile from "../Components/AdminComponents/Profile/Profile";
import UpdateProfile from "../Components/AdminComponents/Profile/UpdateProfile";
import Settings from "../Components/AdminComponents/Profile/Settings";
import ChangePassword from "../Components/AdminComponents/Profile/ChangePassword";

import Post from "../Components/AdminComponents/Showcase/Post";

export default function Student({ handleLogout, user, setUser, setAuthorized }) {
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

          <Route path="/community" element={<Community />} />
          <Route path="/course" element={<Course />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/marketplace/product-req"
            element={<PendingProducts interests={user.interests} />}
          />
          <Route path="/marketplace/cart" element={<Marketplace />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/notification" element={<Notification />} />
          
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/profile/settings" element={<Settings setUser={setUser} setAuthorized={setAuthorized}/>} />
          <Route path="/update-profile" element={<UpdateProfile user={user} setUser={setUser}/>} />
          <Route path="/profile/settings/change-password" element={<ChangePassword/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
