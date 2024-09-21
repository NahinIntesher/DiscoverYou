import React, { useState } from "react";
import "../../../assets/styles/dashboard.css";
import axios from 'axios';

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.student_name,
    dob: user.student_date_of_birth.split('/').reverse().join('-'), // Assuming the format is dd/mm/yyyy
    gender: user.student_gender,
    bio: user.bio || "",
    address: user.student_address,
    phone: user.student_phone,
    email: user.student_email,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/updateProfile', {
        ...formData,
        dob: formData.dob.split('-').reverse().join('/'), // Convert back to dd/mm/yyyy for the database
      });
      setIsEditing(false);
      // Optionally, you might want to refresh user data here
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="mainContent bg-white min-h-screen">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Profile</div>
        </div>
      </div>
      <div className="flex p-6">
        {/* Profile Section */}
        <div className="p-6 bg-[radial-gradient(#ffe79acc,#ffe79a99)] text-black rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 cursor-pointer">Student Profile</h1>
          <p className="text-lg">View and edit your profile</p>

          {isEditing ? (
            <div className="mt-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
                placeholder="Name"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
                placeholder="Bio"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
                placeholder="Address"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
                placeholder="Phone"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-400 rounded"
                placeholder="Email"
              />
              <button onClick={handleSaveProfile} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Save
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-lg"><strong>Name:</strong> {formData.name}</p>
              <p className="text-lg"><strong>Date of Birth:</strong> {formatDate(formData.dob)}</p>
              <p className="text-lg"><strong>Gender:</strong> {formData.gender}</p>
              <p className="text-lg"><strong>Bio:</strong> {formData.bio || "Add a bio to let others know more about you."}</p>
              <button onClick={handleUpdateProfile} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Update Profile
              </button>
            </div>
          )}

          {/* Interests Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Interests</h2>
            <ul className="list-disc list-inside">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <li key={index} className="text-lg">{interest}</li>
                ))
              ) : (
                <p className="text-lg">No interests added yet.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Other sections (Achievements, Contests, Contributions, Contact Information, Settings) remain the same... */}
        {/* You can add the other sections as you had them before. */}
      </div>
    </div>
  );
}
