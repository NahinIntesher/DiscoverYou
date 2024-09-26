import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "../../src/Components/StudentComponents/Sidebar";
import Dashboard from "../Components/StudentComponents/Dashboard/Dashborad";

import Contest from "../Components/StudentComponents/Contest/Contest";
import SingleContest from "../Components/StudentComponents/Contest/SingleContest";

import Showcase from "../Components/StudentComponents/Showcase/Showcase";
import Post from "../Components/StudentComponents/Showcase/Post";

import Course from "../Components/StudentComponents/Course/Course";
import CreateNewCourses from "../Components/StudentComponents/Course/CreateNewCourses";
import PendingParticipants from "../Components/StudentComponents/Course/PendingParticipants";
import PendingCourse from "../Components/StudentComponents/Course/PendingCourses";

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
import ChangePassword from "../Components/StudentComponents/Profile/ChangePassword";
import ChangeInterest from "../Components/StudentComponents/Profile/ChangeInterest";
import PendingCommunities from "../Components/StudentComponents/Community/PendingCommunities";

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
          <Route path="/community/new" element={<CreateNewCommunity interests={user.interests} />} />
          <Route path="/community/members/pending" element={<PendingMembers />} />
          <Route path="/community/pending" element={<PendingCommunities />} />
          <Route path="/community/:communityId" element={<SingleCommunity />} />

          <Route path="/course" element={<Course />} />
          <Route path="/course/new" element={<CreateNewCourses interests={user.interests} />} />
          <Route path="/course/participants/pending" element={<PendingParticipants />} />
          <Route path="/course/pending" element={<PendingCourse />} />
          
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
          <Route path="/profile/settings" element={<Settings setUser={setUser} setAuthorized={setAuthorized}/>} />
          <Route path="/update-profile" element={<UpdateProfile user={user} setUser={setUser}/>} />
          <Route path="/profile/settings/change-password" element={<ChangePassword/>} />
          <Route path="/profile/settings/change-interests" element={<ChangeInterest user={user} setUser={setUser}/>} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}
