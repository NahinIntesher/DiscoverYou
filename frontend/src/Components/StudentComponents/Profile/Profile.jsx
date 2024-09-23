import React, { useState } from "react";
import { Edit2, Save } from "lucide-react";

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.student_name,
    dob: user.student_date_of_birth.split("/").reverse().join("-"),
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
    // Implement save logic here
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Student Profile</h1>
            <button
              className="px-4 py-2 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-100 transition duration-300 flex items-center"
              onClick={isEditing ? handleSaveProfile : handleUpdateProfile}
            >
              {isEditing ? (
                <>
                  <Save size={18} className="mr-2" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit2 size={18} className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          {isEditing ? (
            renderInputFields()
          ) : (
            <div className="space-y-6">
              <ProfileSection title="Personal Information">
                <ProfileField label="Name" value={formData.name} />
                <ProfileField label="Date of Birth" value={formatDate(formData.dob)} />
                <ProfileField label="Gender" value={formData.gender} />
              </ProfileSection>
              <ProfileSection title="Contact Information">
                <ProfileField label="Address" value={formData.address} />
                <ProfileField label="Phone" value={formData.phone} />
                <ProfileField label="Email" value={formData.email} />
              </ProfileSection>
              <ProfileSection title="Bio">
                <p className="text-gray-700">{formData.bio || "No bio available."}</p>
              </ProfileSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderInputFields() {
    return (
      <div className="space-y-4">
        <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} />
        <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} type="date" />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <InputField label="Bio" name="bio" value={formData.bio} onChange={handleInputChange} textarea />
        <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} />
        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" />
      </div>
    );
  }
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

function InputField({ label, name, value, onChange, type = "text", textarea = false }) {
  const inputClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          className={inputClasses}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={inputClasses}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}