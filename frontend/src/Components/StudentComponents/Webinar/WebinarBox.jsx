import React from "react";
import PropTypes from "prop-types";
import { Clock, Users, CalendarDays } from 'lucide-react';

export default function WebinarBox({
  webinar,
  handleJoinClick,
  registrationStatus,
}) {
  const startTime = new Date(webinar.start_time);
  const endTime = new Date(webinar.end_time);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:-translate-y-1 transition-transform duration-300 overflow-hidden flex flex-col w-full sm:w-[450px] m-2">
      <div className="p-6 flex-grow">
        <h4 className="text-xl font-semibold mb-2 line-clamp-2">{webinar.webinar_name}</h4>
        <p className="text-gray-600 mb-4 line-clamp-3">{webinar.webinar_description}</p>
        
        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center text-gray-700">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>{startTime.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2" />
            <span>{startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2" />
            <span>{webinar.participants_count || 0} participants</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 mt-4">
        <button 
          onClick={() => handleJoinClick(webinar)}
          className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold py-2 px-4 rounded-full hover:shadow-lg transition-shadow duration-300"
        >
          {registrationStatus === true ? "Join Webinar" : "Register Now"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          {registrationStatus === true ? "Click to enter the webinar" : "Secure your spot now!"}
        </p>
      </div>
    </div>
  );
}

WebinarBox.propTypes = {
  webinar: PropTypes.shape({
    webinar_id: PropTypes.string.isRequired,
    webinar_name: PropTypes.string.isRequired,
    webinar_description: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    participants_count: PropTypes.number,
  }).isRequired,
  handleJoinClick: PropTypes.func.isRequired,
  registrationStatus: PropTypes.bool.isRequired,
};