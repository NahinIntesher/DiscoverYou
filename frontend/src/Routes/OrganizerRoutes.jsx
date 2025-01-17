import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../src/Components/OrganizerComponents/Sidebar";
import Dashboard from "../Components/OrganizerComponents/Dashboard/Dashborad";

import Contest from "../Components/OrganizerComponents/Contest/Contest";
import SingleContest from "../Components/OrganizerComponents/Contest/SingleContest";
import EditContest from "../Components/OrganizerComponents/Contest/EditContest";

import Showcase from "../Components/OrganizerComponents/Showcase/Showcase";
import Webinar from "../Components/OrganizerComponents/Webinar/Webinar";
import EditWebinar from "../Components/OrganizerComponents/Webinar/EditWebinar";
import Marketplace from "../Components/OrganizerComponents/Marketplace/Marketplace";

import Hiring from "../../src/Components/OrganizerComponents/Hiring/Hiring";
import NewHiring from "../../src/Components/OrganizerComponents/Hiring/NewHiring";
import PendingHirings from "../../src/Components/OrganizerComponents/Hiring/PendingHirings";
import SingleHiring from "../../src/Components/OrganizerComponents/Hiring/SingleHiring";
import EditHiring from "../../src/Components/OrganizerComponents/Hiring/EditHiring";

import Notification from "../../src/Components/OrganizerComponents/Notification/Notification";

import Profile from "../Components/OrganizerComponents/Profile/Profile";
import UpdateProfile from "../Components/OrganizerComponents/Profile/UpdateProfile";
import Settings from "../Components/OrganizerComponents/Profile/Settings";
import ChangePassword from "../Components/OrganizerComponents/Profile/ChangePassword";
import WebinarHosted from "../Components/OrganizerComponents/Profile/Details/WebinarHosted";
import ContestOrganized from "../Components/OrganizerComponents/Profile/Details/ContestOrganized";
import HigingOrganized from "../Components/OrganizerComponents/Profile/Details/HiringOrganized";

import Post from "../Components/OrganizerComponents/Showcase/Post";
import CreateNewWebinar from "../Components/OrganizerComponents/Webinar/CreateNewWebinar";
import PendingWebinar from "../Components/OrganizerComponents/Webinar/PendingWebinar";
import SingleWebinar from "../Components/OrganizerComponents/Webinar/SingleWebinar";
import Product from "../Components/OrganizerComponents/Marketplace/Product";
import ChangeProfilePicture from "../Components/OrganizerComponents/Profile/ChangeProfilePicture";
import Checkout from "../Components/OrganizerComponents/Marketplace/Checkout";
import OrderHistory from "../Components/OrganizerComponents/Marketplace/OrderHistory";
import CommonProfile from "../Components/CommonComponents/CommonProfile/CommonProfile";
import SubmissionPreview from "../Components/CommonComponents/SubmissionPreview";
import CreateNewContest from "../Components/OrganizerComponents/Contest/CreateNewContest";
import PendingContest from "../Components/OrganizerComponents/Contest/PendingContest";

import CommonWebinarHosted from "../Components/CommonComponents/CommonProfile/Organizer/Details/WebinarHosted";
import CommonContestOrganized from "../Components/CommonComponents/CommonProfile/Organizer/Details/ContestOrganized";
import CommonHiringOrganized from "../Components/CommonComponents/CommonProfile/Organizer/Details/HiringOrganized";

import CommonCourseParticipated from "../Components/CommonComponents/CommonProfile/Student/Details/CourseParticipated";
import CommonShowcasePosts from "../Components/CommonComponents/CommonProfile/Student/Details/ShowcasePosts";

import MessaengerHome from "../Components/CommonComponents/Messages/MessengerHome";
import ShowcaseReactors from "../Components/StudentComponents/Showcase/ShowcaseReactors";
import ApplicantCV from "../Components/OrganizerComponents/Hiring/ApplicantCV";

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
      if(event.data.startsWith("message")) {
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
            path="/showcase/reactors/:postId"
            element={<ShowcaseReactors user={user} />}
          />
          <Route
            path="/showcase/post/:postId"
            element={<Post user={user} admins={admins} />}
          />

          <Route path="/contest" element={<Contest user={user} />} />
          <Route path="/contest/new" element={<CreateNewContest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />
          <Route path="/contest/pending" element={<PendingContest />} />

          <Route
            path="contest/pending/edit/:contestId"
            element={<EditContest />}
          />
          <Route
            path="/contest/submission/:contestId/:participantId"
            element={<SubmissionPreview />}
          />

          <Route path="/webinar" element={<Webinar user={user} />} />
          <Route path="/webinar/new" element={<CreateNewWebinar />} />
          <Route path="/webinar/pending" element={<PendingWebinar />} />
          <Route path="/webinar/:webinarId" element={<SingleWebinar />} />
          <Route
            path="webinar/pending/edit/:webinarId"
            element={<EditWebinar />}
          />

          <Route path="/marketplace" element={<Marketplace user={user} />} />
          <Route path="/marketplace/product/:productId" element={<Product />} />
          <Route
            path="/marketplace/checkout/:productId"
            element={<Checkout user={user} />}
          />
          <Route path="/marketplace/order-history" element={<OrderHistory />} />

          <Route path="/hiring" element={<Hiring user={user} />} />
          <Route
            path="/hiring/new"
            element={<NewHiring user={user} admins={admins} />}
          />
          <Route path="/hiring/pending" element={<PendingHirings />} />
          <Route
            path="/hiring/:hiringId"
            element={<SingleHiring ownId={user.organizer_id} />}
          />
          <Route path="/hiring/edit/:hiringId" element={<EditHiring />} />
          <Route path="/hiring/:hiringId/:applicantId" element={<ApplicantCV />} />

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
            path="/profile/webinarResults"
            element={<WebinarHosted user={user} />}
          />
          <Route
            path="/profile/contestResults"
            element={<ContestOrganized user={user} />}
          />
          <Route
            path="/profile/hiringResults"
            element={<HigingOrganized user={user} />}
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
