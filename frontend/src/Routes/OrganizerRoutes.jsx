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

export default function Student({
  handleLogout,
  user,
  setUser,
  setAuthorized,
}) {
  return (
    <BrowserRouter>
      <div className="container" data-theme={user.type}>
        <Sidebar logoutAction={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />

          <Route path="/showcase" element={<Showcase user={user}/>} />
          <Route path="/showcase/post/:postId" element={<Post  user={user}/>} />

          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/:contestId" element={<SingleContest />} />

          <Route path="/webinar" element={<Webinar />} />
          <Route path="/webinar/new" element={<CreateNewWebinar />} />
          <Route path="/webinar/pending" element={<PendingWebinar />} />
          <Route path="/webinar/:webinarId" element={<SingleWebinar />} />

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/product/:productId" element={<Product />} />

          <Route path="/hiring" element={<Hiring />} />
          <Route path="/hiring/new" element={<NewHiring />} />
          <Route path="/hiring/pending" element={<PendingHirings />} />
          <Route path="/hiring/:hiringId" element={<SingleHiring ownId={user.organizer_id}/>} />
          <Route path="/hiring/edit/:hiringId" element={<EditHiring />} />

          <Route path="/notification" element={<Notification />} />

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
          <Route path="/profile/settings/change-profile-picture" element={<ChangeProfilePicture user={user} setUser={setUser}/>} />
          <Route path="/profile/webinarResults" element={<WebinarHosted user={user} />} />
          <Route path="/profile/contestResults" element={<ContestOrganized user={user} />} />
          <Route path="/profile/hiringResults" element={<HigingOrganized user={user} />} />
        
        
        </Routes>
      </div>
    </BrowserRouter>
  );
}
