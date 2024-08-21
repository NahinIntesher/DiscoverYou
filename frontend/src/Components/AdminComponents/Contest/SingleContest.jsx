import React, { useState } from "react";
import ContestProblems from "./ContestProblems";
import ContestSubmissions from "./ContestSubmissions";
import ContestParticipants from "./ContestParticipants";

export default function SingleContest() {
  const [activeTab, setActiveTab] = useState("problems");

  return (
    <div className="mainContent">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Single Contest</h2>

        <div className="tabs mb-6">
          <div className="flex border-b border-gray-300">
            <button
              className={`${
                activeTab === "problems"
                  ? "bg-white text-blue-600 border-blue-500"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } px-6 py-3 rounded-t-lg border-b-4 transition-colors duration-300 ease-in-out mr-4`}
              onClick={() => setActiveTab("problems")}
            >
              Contest Problems
            </button>
            <button
              className={`${
                activeTab === "participants"
                  ? "bg-white text-green-600 border-green-500"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } px-6 py-3 rounded-t-lg border-b-4 transition-colors duration-300 ease-in-out mr-4`}
              onClick={() => setActiveTab("participants")}
            >
              Contest Participants
            </button>
            <button
              className={`${
                activeTab === "submissions"
                  ? "bg-white text-yellow-600 border-yellow-500"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } px-6 py-3 rounded-t-lg border-b-4 transition-colors duration-300 ease-in-out`}
              onClick={() => setActiveTab("submissions")}
            >
              Contest Submissions
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "problems" && (
            <div className="bg-blue-50 rounded-lg p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Contest Problems
              </h3>
              <ContestProblems />
            </div>
          )}
          {activeTab === "participants" && (
            <div className="bg-green-50 rounded-lg p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-green-600 mb-4">
                Contest Participants
              </h3>
              <ContestParticipants />
            </div>
          )}
          {activeTab === "submissions" && (
            <div className="bg-yellow-50 rounded-lg p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-yellow-600 mb-4">
                Contest Submissions
              </h3>
              <ContestSubmissions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
