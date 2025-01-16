import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../src/Components/AdminComponents/Sidebar";
import Dashboard from "../Components/AdminComponents/Dashboard/Dashborad";

import Contest from "../Components/AdminComponents/Contest/Contest";
import SingleContest from "../Components/AdminComponents/Contest/SingleContest";

import Showcase from "../Components/AdminComponents/Showcase/Showcase";
import Community from "../Components/AdminComponents/Community/Community";
import Webinar from "../Components/AdminComponents/Webinar/Webinar";
import Marketplace from "../Components/AdminComponents/Marketplace/Marketplace";
import PendingProducts from "../Components/AdminComponents/Marketplace/PendingProducts";

import Course from "../Components/AdminComponents/Course/Course";
import PendingCourse from "../Components/AdminComponents/Course/PendingCourses";
import SingleCourse from "../Components/AdminComponents/Course/SingleCourse";

import Hiring from "../../src/Components/AdminComponents/Hiring/Hiring";
import Notification from "../Components/AdminComponents/Notification/Notification";

import Profile from "../Components/AdminComponents/Profile/Profile";
import UpdateProfile from "../Components/AdminComponents/Profile/UpdateProfile";
import Settings from "../Components/AdminComponents/Profile/Settings";
import ChangePassword from "../Components/AdminComponents/Profile/ChangePassword";

import Post from "../Components/AdminComponents/Showcase/Post";
import SingleWebinar from "../Components/AdminComponents/Webinar/SingleWebinar";
import Product from "../Components/AdminComponents/Marketplace/Product";
import ChangeProfilePicture from "../Components/AdminComponents/Profile/ChangeProfilePicture";
import SingleHiring from "../Components/AdminComponents/Hiring/SingleHiring";

import UserManagement from "../Components/AdminComponents/UserManagement/UserManagement";
import GiveRewards from "../Components/AdminComponents/UserManagement/GiveRewards";
import CommonProfile from "../Components/CommonComponents/CommonProfile/CommonProfile";


import CommonWebinarHosted from "../Components/CommonComponents/CommonProfile/Organizer/Details/WebinarHosted";
import CommonContestOrganized from "../Components/CommonComponents/CommonProfile/Organizer/Details/ContestOrganized";
import CommonHiringOrganized from "../Components/CommonComponents/CommonProfile/Organizer/Details/HiringOrganized";

import CommonCourseParticipated from "../Components/CommonComponents/CommonProfile/Student/Details/CourseParticipated";
import CommonShowcasePosts from "../Components/CommonComponents/CommonProfile/Student/Details/ShowcasePosts";



export default function Student({
  handleLogout,
  user,
  admins,
  setUser,
  setAuthorized,
}) {
  const [notificationUpdate, setNotificationUpdate] = useState(0);

  return (
    <BrowserRouter>
      <div className="container" data-theme={user.type}>
        <Sidebar
          logoutAction={handleLogout}
          user={user}
          notificationUpdate={notificationUpdate}
        />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />

          <Route path="/showcase" element={<Showcase user={user} />} />
          <Route path="/showcase/post/:postId" element={<Post user={user} />} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />

          <Route path="/community" element={<Community />} />

          <Route path="/webinar" element={<Webinar />} />
          <Route path="/webinar/:webinarId" element={<SingleWebinar />} />

          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/marketplace/product-req"
            element={<PendingProducts interests={user.interests} />}
          />
          <Route path="/marketplace/product/:productId" element={<Product />} />

          <Route path="/course" element={<Course />} />
          <Route path="/course/pending" element={<PendingCourse />} />
          <Route path="/course/:courseId" element={<SingleCourse />} />

          <Route path="/marketplace/cart" element={<Marketplace />} />

          <Route path="/hiring" element={<Hiring />} />
          <Route path="/hiring/:hiringId" element={<SingleHiring />} />

          <Route
            path="/notification"
            element={
              <Notification
                notificationUpdate={notificationUpdate}
                setNotificationUpdate={setNotificationUpdate}
              />
            }
          />

          <Route path="/profile" element={<Profile user={user} />} />
          <Route
            path="/profile/settings"
            element={
              <Settings setUser={setUser} setAuthorized={setAuthorized} />
            }
          />
          <Route
            path="/update-profile"
            element={<UpdateProfile user={user} setUser={setUser} />}
          />
          <Route
            path="/profile/settings/change-password"
            element={<ChangePassword />}
          />
          <Route
            path="/profile/settings/change-profile-picture"
            element={<ChangeProfilePicture user={user} setUser={setUser} />}
          />

          <Route
            path="/user-management"
            element={<UserManagement user={user} setUser={setUser} />}
          />
          <Route
            path="/user-management/give-reward/:userId"
            element={<GiveRewards user={user} setUser={setUser} />}
          />



<Route
            path="/profile/webinarResults/:paramId"
            element={<CommonWebinarHosted />}
          />
          <Route
            path="/profile/contestResults/:paramId"
            element={<CommonContestOrganized />}
          />
          <Route
            path="/profile/hiringResults/:paramId"
            element={<CommonHiringOrganized />}
          />

          <Route
            path="/profile/courseResults/:paramId"
            element={<CommonCourseParticipated />}
          />
          <Route
            path="/profile/showcaseResults/:paramId"
            element={<CommonShowcasePosts />}
          />
          <Route path="/profile/:paramId" element={<CommonProfile mainUser={user}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
