import axios from "axios";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../CommonComponents/NotFound";

export default function BrowseAdmin() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  function fetchAdmins() {
    axios
      .get("http://localhost:3000/admin/user-management/admins")
      .then((response) => {
        setAdmins(response.data.admins);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="tabContent">
      <div className="participantList">
      {admins.length > 0 ? (
        admins.map((admin) => (
          <UserBox
            key={admin.admin_id}
            id={admin.admin_id}
            name={admin.admin_name}
            email={admin.admin_email}
            picture={admin.admin_picture}
            mobileNo={admin.admin_mobile_no}
            address={admin.admin_address}
            gender={admin.admin_gender}
            date_of_birth={admin.admin_date_of_birth}
            refreshUsers={fetchAdmins}
          />
        ))
      ) : (
        <NotFound message="No admin Found" />
      )}
      </div>
    </div>
  );
}
