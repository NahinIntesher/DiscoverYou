import React from "react";
import "../../../assets/styles/dashboard.css";

import {
  User,
  Award,
  Trophy,
  Heart,
  Phone,
  Mail,
  Settings,
} from "lucide-react";

const Showcase = ({ user }) => {
  const backgroundStyle = {
    backgroundImage: `
      radial-gradient(80px 30px at left top, rgba(var(--light), 0.8), rgba(var(--light), 0.6), transparent),
        linear-gradient(rgb(var(--dark)), rgb(var(--medium)));
    `,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
  };

  const sectionStyle =
    "p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl";
  const titleStyle = "text-2xl font-bold mb-2 flex items-center gap-2";
  const subtitleStyle = "text-lg text-gray-600 mb-4";
  const contentStyle = "text-lg";

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Profile</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <User className="text-blue-600" />
              Student Profile
            </h2>
            <p className={subtitleStyle}>View and edit your profile</p>
            <div className={contentStyle}>
              <p>
                <strong>Name:</strong> {user.student_name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {user.student_date_of_birth}
              </p>
              <p>
                <strong>Gender:</strong> {user.student_gender}
              </p>
              <p>
                <strong>Bio:</strong>{" "}
                {user.bio || "Add a bio to let others know more about you."}
              </p>
            </div>
          </div>

          {/* Achievement Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <Award className="text-yellow-600" />
              Achievements
            </h2>
            <p className={subtitleStyle}>List your achievements here...</p>
            {/* Add achievement content here */}
          </div>

          {/* Contest Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <Trophy className="text-green-600" />
              Contests
            </h2>
            <p className={subtitleStyle}>
              Participated and organized contests...
            </p>
            {/* Add contest content here */}
          </div>

          {/* Interests Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <Heart className="text-red-600" />
              Interests
            </h2>
            <p className={subtitleStyle}>Your areas of interest</p>
            <ul className="list-disc list-inside">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <li key={index} className={contentStyle}>
                    {interest}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No interests added yet.</p>
              )}
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <Phone className="text-indigo-600" />
              Contact Information
            </h2>
            <p className={subtitleStyle}>How to reach you</p>
            <div className={contentStyle}>
              <p>
                <strong>Address:</strong> {user.student_address}
              </p>
              <p>
                <strong>Phone:</strong> {user.student_phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="text-indigo-600" size={20} />
                <strong>Email:</strong> {user.student_email}
              </p>
            </div>
          </div>

          {/* Settings Section */}
          <div className={sectionStyle}>
            <h2 className={titleStyle}>
              <Settings className="text-gray-600" />
              Settings
            </h2>
            <p className={subtitleStyle}>Change your account settings</p>
            {/* Add settings options here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
