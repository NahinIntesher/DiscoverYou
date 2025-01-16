// MessengerSidebar Component
import React, { useEffect, useState } from "react";
import axios from "axios";
import dp from "../../../assets/images/default.jpg";
import { Link } from "react-router-dom";

export default function MessengerSidebar({ user, setActiveContactId, activeContactId, setMessageUpdate}) {
  const [contacts, setContacts] = useState([]);

  console.log("ador", activeContactId);

  useEffect(() => {
    function fetchCommunityData() {
      axios
      .get("http://localhost:3000/messages/contacts")
      .then((res) => {
        console.log("Success");
        const contactsData = res.data?.contacts || [];

        console.log(contactsData);
        setContacts(contactsData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });

    }

    fetchCommunityData();
    const interval = setInterval(fetchCommunityData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="MessengerSidebar">
      <div className="title">Inbox</div>
      <div className="contactContainer">
        {
          contacts.map((contact) => {
            return (
              <Link 
                to={"/message/"+contact.other_user_id} 
                className={contact.last_message_status == 1 ? (contact.other_user_id == activeContactId ? "contactBox contactBoxActive" : "contactBox") : "contactBox contactBoxUnread"} 
                key={contact.other_user_id}
                onClick={() => setMessageUpdate(old => old + 1)}
              >
                <div className="contactPicture">
                  <img src={contact.other_user_picture ? contact.other_user_picture : dp} alt="Contact" />
                </div>
                <div className="contactDetails">
                  <div className="contactName">{contact.other_user_name}</div>
                  <div className="lastMessage">{contact.last_message}</div>
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
}
