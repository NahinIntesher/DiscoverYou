import axios from "axios";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function BrowseOrganizer() {
  const [organizersData, setOrganizersData] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  function fetchOrganizers() {
    axios
      .get("http://localhost:3000/admin/user-management/organizers")
      .then((res) => {
        const organizerData = res.data?.organizers || [];
        setOrganizersData(organizerData);
        setOrganizers(organizerData);
      })
      .catch((error) => {
        console.error("Error fetching organizers:", error);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredorganizerData;
    let searchTextValue = name == "search" ? value : searchText;

    filteredorganizerData = organizersData.filter((organizer) =>
      organizer.organizer_name
        .toLowerCase()
        .includes(searchTextValue.toLowerCase())
    );
    setOrganizers(filteredorganizerData);
    setSearchText(searchTextValue);
  };

  return (
    <div className="tabContent">
      <div className="filterBox filterBoxCommunity">
        <div className="searchBoxAdmin">
          <MaterialSymbol className="icon" size={22} icon="search" />
          <input
            name="search"
            onChange={handleInputChange}
            placeholder="Search by name..."
          />
        </div>
      </div>
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
