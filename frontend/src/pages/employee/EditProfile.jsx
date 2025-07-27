import React, { useState } from "react";
import useAuth from "../../contexts/useAuth";
import { updateProfile } from "../../services/employeeService";

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (photo) formData.append("photo", photo);

    try {
      setLoading(true);
      const updated = await updateProfile(formData);
      login(updated.user); // Refresh auth context
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-teal-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-teal-500 focus:outline-none"
            rows="3"
            placeholder="A few lines about yourself..."
          />
        </div>

        {/* Photo Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-24 h-24 rounded-full border-2 border-teal-500 object-cover"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
