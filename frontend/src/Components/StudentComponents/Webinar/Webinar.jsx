import React, { useState, useEffect } from "react";
import axios from "axios";
import WebinarBox from "./WebinarBox";

export default function Webinar() {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/webinars")
      .then((response) => {
        setWebinars(response.data.webinars);
      })
      .catch((error) => {
        console.error("Error fetching the webinars data:", error);
      });
  }, []);

  const now = new Date();

  const ongoingWebinars = webinars.filter(
    (webinar) =>
      now >= new Date(webinar.start_time) && now <= new Date(webinar.end_time)
  );
  const upcomingWebinars = webinars.filter(
    (webinar) => now < new Date(webinar.start_time)
  );
  const previousWebinars = webinars.filter(
    (webinar) => now > new Date(webinar.end_time)
  );

  const handleJoinClick = (webinar) => {
    axios
      .get(
        `http://localhost:3000/student/webinars/${webinar.webinar_id}/register`
      )
      .then((response) => {
        if (response.data.isRegistered) {
          window.open(webinar.meeting_link, "_blank");
        } else {
          setSelectedWebinar(webinar);
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error checking registration:", error);
      });
  };

  const handleRegister = () => {
    axios
      .post(
        `http://localhost:3000/student/webinars/${selectedWebinar.webinar_id}/register`
      )
      .then((response) => {
        setShowModal(false);
        setRegistrationStatus(response.data.isRegistered);
      })
      .catch((error) => {
        console.error("Error registering:", error);
      });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="mainContent bg-gradient-to-b from-orange-100 to-white min-h-screen">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Webinars</div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="space-y-12">
          {/* Ongoing Webinars */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ongoing Webinars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingWebinars.length > 0 ? (
                ongoingWebinars.map((webinar) => (
                  <WebinarBox
                    key={webinar.webinar_id}
                    webinar={webinar}
                    handleJoinClick={handleJoinClick}
                    registrationStatus={registrationStatus}
                  />
                ))
              ) : (
                <p className="text-gray-500 italic">No ongoing webinars at the moment.</p>
              )}
            </div>
          </div>

          {/* Upcoming Webinars */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Webinars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWebinars.length > 0 ? (
                upcomingWebinars.map((webinar) => (
                  <WebinarBox
                    key={webinar.webinar_id}
                    webinar={webinar}
                    handleJoinClick={handleJoinClick}
                    registrationStatus={registrationStatus}
                  />
                ))
              ) : (
                <p className="text-gray-500 italic">No upcoming webinars scheduled.</p>
              )}
            </div>
          </div>

          {/* Previous Webinars */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Previous Webinars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousWebinars.length > 0 ? (
                previousWebinars.map((webinar) => (
                  <WebinarBox
                    key={webinar.webinar_id}
                    webinar={webinar}
                    handleJoinClick={handleJoinClick}
                    registrationStatus={webinar.isRegistered}
                  />
                ))
              ) : (
                <p className="text-gray-500 italic">No previous webinars available.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Registration Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Registration</h2>
            <p className="mb-6">Do you want to register for this webinar?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded hover:from-orange-500 hover:to-red-600 transition-colors"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}