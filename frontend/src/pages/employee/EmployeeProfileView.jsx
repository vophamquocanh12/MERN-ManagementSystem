import React, { useEffect, useState } from "react";
import api from "@/services/api";
import useAuth from "../../contexts/useAuth"; // ✅ Correct

const EmployeeProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/employees/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (user?._id) fetchProfile();
  }, [user]);

  if (!profile) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {profile.employee?.photoUrl && (
        <img
          src={profile.employee.photoUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
      )}

      <div className="mb-2">
        <strong>Name:</strong> {profile.user.name}
      </div>

      <div className="mb-2">
        <strong>Email:</strong> {profile.user.email}
      </div>

      {profile.employee?.bio && (
        <div className="mb-2">
          <strong>Bio:</strong> {profile.employee.bio}
        </div>
      )}

      {profile.employee?.department?.name && (
        <div className="mb-2">
          <strong>Department:</strong> {profile.employee.department.name}
        </div>
      )}
    </div>
  );
};

export default EmployeeProfileView;
