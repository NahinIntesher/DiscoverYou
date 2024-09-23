import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const extractDate = (dateString) => {
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    }
    
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return dateString;
    }
    
    return "";
  };

  const [formData, setFormData] = useState({
    name: user.organizer_name,
    date_of_birth: extractDate(user.organizer_date_of_birth),
    gender: user.organizer_gender,
    address: user.organizer_address,
    phone: user.organizer_mobile_no,
    email: user.organizer_email,
  });

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Profile</div>
          <div className="buttonContainer">
            <Link to="/update-profile" className="button">
              <MaterialSymbol className="icon" size={24} icon="edit" />
              <div className="text">Edit Profile</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="p-6">
        {isEditing ? (
          <UpdateProfile />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-5">
              <img
                src="" // Add the user's profile image URL here
                alt="Profile"
                width={200}
                height={200}
                className="bg-gray-300 border-indigo-500 border-4 rounded-full flex items-center justify-center"
              />
              <p className="text-2xl text-black font-semibold">{formData.name}</p>
            </div>
            <ProfileSection title="Personal Information">
              <ProfileField
                label="Date of Birth"
                value={formData.date_of_birth}
              />
              <ProfileField label="Gender" value={formData.gender} />
            </ProfileSection>
            <ProfileSection title="Contact Information">
              <ProfileField label="Address" value={formData.address} />
              <ProfileField label="Phone" value={formData.phone} />
              <ProfileField label="Email" value={formData.email} />
            </ProfileSection>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}:</span>{" "}
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
