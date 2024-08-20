import React from "react";
import "../../assets/styles/dashboard.css";

export default function Profile({ user }) {
  return (
    <div className="mainContent p-8 bg-[#feffdf] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">Organizer Profile</h1>
          <p className="text-lg">View and edit your profile</p>
          <div className="mt-4">
            <p className="text-lg">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>Date of Birth:</strong> {user.dateOfBirth}
            </p>
            <p className="text-lg">
              <strong>Gender:</strong> {user.gender}
            </p>
            <p className="text-lg">
              <strong>Bio:</strong>{" "}
              {user.bio || "Add a bio to let others know more about you."}
            </p>
            {/* Interests Section */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Interests</h2>
              <ul className="list-disc list-inside">
                {user.interests && user.interests.length > 0 ? (
                  user.interests.map((interest, index) => (
                    <li key={index} className="text-lg">
                      {interest}
                    </li>
                  ))
                ) : (
                  <p className="text-lg">No interests added yet.</p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">
            Achievements
          </h1>
          <p className="text-lg">List your achievements here...</p>
          {/* Add more details as needed */}
        </div>

        {/* Contest Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">Contests</h1>
          <p className="text-lg">Participated and organized contests...</p>
          {/* Add more details as needed */}
        </div>

        {/* Contribution Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">
            Contributions
          </h1>
          <p className="text-lg">Your contributions to the community...</p>
          {/* Add more details as needed */}
        </div>

        {/* Contact with User Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">
            Contact Information
          </h1>
          <p className="text-lg">
            <strong>Address:</strong> {user.address}
          </p>
          <p className="text-lg">
            <strong>Phone:</strong> {user.phone}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Settings Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">Settings</h1>
          <p className="text-lg">Change your account settings</p>
          {user.category === "admin" && (
            <p className="text-lg">
              <strong>Admin Key:</strong> {user.adminKey}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
