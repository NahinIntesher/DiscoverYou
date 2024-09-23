import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "../../src/Components/StudentComponents/Sidebar";
import Dashboard from "../Components/StudentComponents/Dashboard/Dashborad";

import Contest from "../Components/StudentComponents/Contest/Contest";
import SingleContest from "../Components/StudentComponents/Contest/SingleContest";

import Showcase from "../Components/StudentComponents/Showcase/Showcase";
import Post from "../Components/StudentComponents/Showcase/Post";

import Course from "../Components/StudentComponents/Course/Course";

import Webinar from "../Components/StudentComponents/Webinar/Webinar";
import SingleWebinar from "../Components/StudentComponents/Webinar/SingleWebinar";

import Hiring from "../../src/Components/StudentComponents/Hiring/Hiring";
import Notification from "../Components/StudentComponents/Notification/Notification";
import Profile from "../Components/StudentComponents/Profile/Profile";

import Community from "../Components/StudentComponents/Community/Community";
import CreateNewCommunity from "../Components/StudentComponents/Community/CreateNewCommunity";
import SingleCommunity from "../Components/StudentComponents/Community/SingleCommunity";
import PendingMembers from "../Components/StudentComponents/Community/PendingMembers";

import Marketplace from "../Components/StudentComponents/Marketplace/Marketplace";
import AddProduct from "../Components/StudentComponents/Marketplace/AddProduct";
import UpdateProfile from "../Components/StudentComponents/Profile/UpdateProfile";
import Settings from "../Components/StudentComponents/Profile/Settings";
import ChangePassword from "../Components/AdminComponents/Profile/ChangePassword";

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

          <Route path="/community" element={<Community />} />
          <Route
            path="/community/new"
            element={<CreateNewCommunity interests={user.interests} />}
          />
          <Route
            path="/community/members/pending"
            element={<PendingMembers />}
          />
          <Route path="/community/:communityId" element={<SingleCommunity />} />

          <Route path="/course" element={<Course />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/webinar/:webinarId" element={<SingleWebinar />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/marketplace/add-product"
            element={<AddProduct interests={user.interests} />}
          />
          <Route path="/marketplace/cart" element={<Marketplace />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/profile/settings" element={<Settings/>} />
          <Route path="/profile/settings/change-password" element={<ChangePassword/>} />
          <Route path="/update-profile" element={<UpdateProfile user={user} />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}
