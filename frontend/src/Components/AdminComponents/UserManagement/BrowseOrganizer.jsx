import axios from "axios";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../CommonComponents/NotFound";

export default function BrowseOrganizer() {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  function fetchOrganizers() {
    axios
      .get("http://localhost:3000/admin/user-management/organizers")
      .then((response) => {
        setOrganizers(response.data.organizers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="tabContent">
      <div className="participantList">
      {organizers.length > 0 ? (
        organizers.map((organizer) => (
          <UserBox
            key={organizer.organizer_id}
            id={organizer.organizer_id}
            name={organizer.organizer_name}
            email={organizer.organizer_email}
            picture={organizer.organizer_picture}
            mobileNo={organizer.organizer_mobile_no}
            address={organizer.organizer_address}
            gender={organizer.organizer_gender}
            date_of_birth={organizer.organizer_date_of_birth}
            refreshUsers={fetchOrganizers}
          />
        ))
      ) : (
        <NotFound message="No organizer Found" />
      )}
      </div>
    </div>
  );
}
