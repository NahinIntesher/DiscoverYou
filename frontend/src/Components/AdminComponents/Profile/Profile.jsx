import React, { useState } from "react";
import axios from "axios";
import "../../../assets/styles/profile.css";

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.admin_name,
    dob: user.admin_date_of_birth.split("/").reverse().join("-"), // Assuming the format is dd/mm/yyyy
    gender: user.admin_gender,
    bio: user.bio || "",
    address: user.admin_address,
    phone: user.admin_phone,
    email: user.admin_email,
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
      await axios.post(
        "http://localhost:3000/admin/profile/updateProfile",
        {
          ...formData,
          dob: formData.dob.split("-").reverse().join("/"), // Convert back to dd/mm/yyyy for the database
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Profile</div>
        </div>
      </div>
      <div className="profileContainer">
        <div className="profileHeader">
          <h1 className="title">Admin Profile</h1>
          <button className="editButton" onClick={isEditing ? handleSaveProfile : handleUpdateProfile}>
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
        <div className="profileContent">
          {isEditing ? (
            renderInputFields()
          ) : (
            <>
              <div className="section">
                <h2 className="sectionTitle">Personal Information</h2>
                <div className="sectionContent">
                  <ProfileField label="Name" value={formData.name} />
                  <ProfileField label="Date of Birth" value={formatDate(formData.dob)} />
                  <ProfileField label="Gender" value={formData.gender} />
                </div>
              </div>
              <div className="section">
                <h2 className="sectionTitle">Contact Information</h2>
                <div className="sectionContent">
                  <ProfileField label="Address" value={formData.address} />
                  <ProfileField label="Phone" value={formData.phone} />
                  <ProfileField label="Email" value={formData.email} />
                </div>
              </div>
              <div className="section">
                <h2 className="sectionTitle">Bio</h2>
                <div className="sectionContent">
                  <p>{formData.bio || "No bio available."}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  function renderInputFields() {
    return (
      <>
        <div className="inputGroup">
          <label className="inputLabel">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="inputField"
            placeholder="Name"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="inputField"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="inputField"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="inputField"
            placeholder="Bio"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="inputField"
            placeholder="Address"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="inputField"
            placeholder="Phone"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="inputField"
            placeholder="Email"
          />
        </div>
      </>
    );
  }
}

function ProfileField({ label, value }) {
  return (
    <div className="profileField">
      <p className="text-lg font-medium">
        <strong>{label}:</strong> {value}
      </p>
    </div>
  );
}