// MessengerSidebar Component
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MessengerSidebar({ user, setActiveContact, activeContact }) {
  const [contacts, setContacts] = useState([]);

  console.log("ador", activeContact);

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
      <div className="contactContainer">
        {
          contacts.map((contact) => {
            return (
              <div className={contact.last_message_status == 1 ? (contact.other_user_id == activeContact.other_user_id ? "contactBox contactBoxActive" : "contactBox") : "contactBox contactBoxUnread"} onClick={function () { setActiveContact(contact) }}>
                <div className="contactPicture">
                  <img src={contact.other_user_picture} alt="Contact" />
                </div>
                <div className="contactDetails">
                  <div className="contactName">{contact.other_user_name}</div>
                  <div className="lastMessage">{contact.last_message}</div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
