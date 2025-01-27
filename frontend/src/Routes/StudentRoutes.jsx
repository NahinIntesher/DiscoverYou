import React, { useEffect, useState } from "react";
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
import SingleCourse from "../Components/StudentComponents/Course/SingleCourse";

import Webinar from "../Components/StudentComponents/Webinar/Webinar";
import SingleWebinar from "../Components/StudentComponents/Webinar/SingleWebinar";

import Hiring from "../../src/Components/StudentComponents/Hiring/Hiring";
import SingleHiring from "../../src/Components/StudentComponents/Hiring/SingleHiring";

import Notification from "../Components/StudentComponents/Notification/Notification";
import Profile from "../Components/StudentComponents/Profile/Profile";
import CourseParticipated from "../Components/StudentComponents/Profile/Details/CourseParticipated";
import WebinarParticipated from "../Components/StudentComponents/Profile/Details/WebinarParticipated";
import ContestParticipated from "../Components/StudentComponents/Profile/Details/ContestParticipated";
import ShowcasePosts from "../Components/StudentComponents/Profile/Details/ShowcasePosts";

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
import PendingProducts from "../Components/StudentComponents/Marketplace/PendingProducts";
import Product from "../Components/StudentComponents/Marketplace/Product";
import Material from "../Components/StudentComponents/Course/Material";
import ChangeProfilePicture from "../Components/StudentComponents/Profile/ChangeProfilePicture";
import ShowcaseReactors from "../Components/StudentComponents/Showcase/ShowcaseReactors";
import PendingApplications from "../Components/StudentComponents/Hiring/PendingApplications";
import Checkout from "../Components/StudentComponents/Marketplace/Checkout";
import OrderHistory from "../Components/StudentComponents/Marketplace/OrderHistory";
import SubmissionPreview from "../Components/CommonComponents/SubmissionPreview";
import CommonProfile from "../Components/CommonComponents/CommonProfile/CommonProfile";
import CommonCourseParticipated from "../Components/CommonComponents/CommonProfile/Student/Details/CourseParticipated";
import CommonWebinarParticipated from "../Components/CommonComponents/CommonProfile/Student/Details/WebinarParticipated";
import CommonContestParticipated from "../Components/CommonComponents/CommonProfile/Student/Details/ContestParticipated";
import CommonShowcasePosts from "../Components/CommonComponents/CommonProfile/Student/Details/ShowcasePosts";
import CommonHiringOrganized from "../Components/CommonComponents/CommonProfile/Organizer/Details/HiringOrganized";

import ApplyHiring from "../Components/StudentComponents/Hiring/ApplyHiring";
import MessaengerHome from "../Components/CommonComponents/Messages/MessengerHome";
import EditCommunity from "../Components/StudentComponents/Community/EditCommunity";
import EditCourse from "../Components/StudentComponents/Course/EditCourse";

import EditProduct from "../Components/StudentComponents/Marketplace/EditProduct";

export default function Student({
  handleLogout,
  user,
  admins,
  setUser,
  setAuthorized,
}) {
  const [notificationUpdate, setNotificationUpdate] = useState(0);
  const [messageUpdate, setMessageUpdate] = useState(0);
  let socket;

  useEffect(() => {
    socket = new WebSocket("ws://localhost:8420");

    socket.onmessage = (event) => {
      console.log(event.data);
      if (event.data.startsWith("message")) {
        setMessageUpdate((prevData) => prevData + 1);
      }
    };

    socket.onclose = () => {
      console.log("Web Socket connection closed.");
    };

    // Clean up on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="container" data-theme={user.type}>
        <Sidebar
          logoutAction={handleLogout}
          user={user}
          notificationUpdate={notificationUpdate}
          messageUpdate={messageUpdate}
        />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />

          <Route
            path="/showcase"
            element={<Showcase user={user} admins={admins} />}
          />
          <Route
            path="/showcase/post/:postId"
            element={<Post user={user} admins={admins} />}
          />
          <Route
            path="/showcase/reactors/:postId"
            element={<ShowcaseReactors user={user} />}
          />

          <Route path="/contest" element={<Contest user={user} />} />
          <Route
            path="/contest/submission/:contestId/:participantId"
            element={<SubmissionPreview />}
          />
          <Route path="/contest/:contestId" element={<SingleContest />} />

          <Route path="/community" element={<Community user={user} />} />
          <Route
            path="/community/pending/edit/:communityId"
            element={<EditCommunity />}
          />
          <Route
            path="/community/new"
            element={
              <CreateNewCommunity
                interests={user.interests}
                user={user}
                admins={admins}
              />
            }
          />
          <Route
            path="/community/members/pending"
            element={<PendingMembers user={user} />}
          />
          <Route
            path="/community/pending"
            element={<PendingCommunities user={user} />}
          />
          <Route
            path="/community/:communityId"
            element={<SingleCommunity user={user} />}
          />

          <Route path="/course" element={<Course user={user} />} />
          <Route path="/course/material/:materialId" element={<Material />} />
          <Route
            path="/course/pending/edit/:courseId"
            element={<EditCourse />}
          />

          <Route
            path="/course/new"
            element={
              <CreateNewCourses
                interests={user.interests}
                user={user}
                admins={admins}
              />
            }
          />
          <Route
            path="/course/participants/pending"
            element={<PendingParticipants />}
          />
          <Route path="/course/pending" element={<PendingCourse />} />
          <Route path="/course/:courseId" element={<SingleCourse />} />
          {/* <Route path="/course/:courseId/add-material" element={<AddMaterial />} /> */}

          <Route path="/webinar" element={<Webinar user={user} />} />
          <Route path="/webinar/:webinarId" element={<SingleWebinar />} />

          <Route path="/marketplace" element={<Marketplace user={user} />} />
          <Route
            path="/marketplace/pending-products/edit/:productId"
            
            element={<EditProduct user={user} interests={user.interests}/>}
          />
          <Route
            path="/marketplace/add-product"
            element={
              <AddProduct
                interests={user.interests}
                user={user}
                admins={admins}
              />
            }
          />
          <Route
            path="/marketplace/pending-products"
            element={<PendingProducts />}
          />
          <Route path="/marketplace/product/:productId" element={<Product />} />
          <Route
            path="/marketplace/checkout/:productId"
            element={<Checkout user={user} />}
          />
          <Route path="/marketplace/order-history" element={<OrderHistory />} />

          <Route path="/hiring" element={<Hiring user={user} />} />
          <Route
            path="/hiring/applications"
            element={<PendingApplications />}
          />
          <Route path="/hiring/:hiringId" element={<SingleHiring />} />
          <Route path="/hiring/apply/:hiringId" element={<ApplyHiring />} />

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
            path="/profile/settings/change-interests"
            element={<ChangeInterest user={user} setUser={setUser} />}
          />
          <Route
            path="/profile/courseResults"
            element={<CourseParticipated user={user} />}
          />
          <Route
            path="/profile/webinarResults"
            element={<WebinarParticipated user={user} />}
          />
          <Route
            path="/profile/contestResults"
            element={<ContestParticipated user={user} />}
          />
          <Route
            path="/profile/showcaseResults"
            element={<ShowcasePosts user={user} admins={admins} />}
          />

          <Route
            path="/profile/courseResults/:paramId"
            element={<CommonCourseParticipated />}
          />
          <Route
            path="/profile/webinarResults/:paramId"
            element={<CommonWebinarParticipated />}
          />
          <Route
            path="/profile/contestResults/:paramId"
            element={<CommonContestParticipated />}
          />
          <Route
            path="/profile/showcaseResults/:paramId"
            element={<CommonShowcasePosts />}
          />
          <Route
            path="/profile/hiringResults/:paramId"
            element={<CommonHiringOrganized />}
          />

          <Route
            path="/message/:otherUserId"
            element={
              <MessaengerHome
                user={user}
                messageUpdate={messageUpdate}
                setMessageUpdate={setMessageUpdate}
              />
            }
          />

          <Route
            path="/message"
            element={
              <MessaengerHome
                user={user}
                messageUpdate={messageUpdate}
                setMessageUpdate={setMessageUpdate}
              />
            }
          />

          <Route
            path="/profile/:paramId"
            element={<CommonProfile mainUser={user} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
