// src/pages/employee/ViewProfile.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import male from "../../assets/image/male.jpg";
import female from "../../assets/image/female.jpg";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(
          `${import.meta.env.VITE_API_URL}/employees/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data?.success && data?.user) {
          setProfile(data);
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Unable to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">🔄 Đang tải hồ sơ...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const { user, employee } = profile;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        👤 Hồ sơ của tôi
      </h2>

      <div className="flex items-center gap-5 mb-5">
        <img
          src={employee?.gender === "male" ? male : female}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-xl font-semibold">{user?.name || "Unnamed"}</h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div>
          <h3 className="text-xl font-semibold">{user?.name || "Unnamed"}</h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <strong className="text-gray-700">Phòng ban:</strong>{" "}
        <span className="text-gray-800">
          {employee?.department?.name || "Chưa được giao"}
        </span>
      </div>

      <div className="mb-4">
        <strong className="text-gray-700">Tiểu sử ngắn:</strong>
        <p className="mt-1 text-gray-700 whitespace-pre-line">
          {employee?.bio || "Chưa có tiểu sử."}
        </p>
      </div>

      <div className="mb-4">
        <strong className="text-gray-700">Kỹ năng</strong>
        <p className="mt-1 text-gray-700 whitespace-pre-line">
          {employee?.skills &&
            employee?.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mr-1"
              >
                {skill}
              </span>
            ))}
        </p>
      </div>

      {employee?.resumeUrl && (
        <div className="mb-4">
          <strong className="text-gray-700">Resume:</strong>{" "}
          <a
            href={employee.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            📄 View Resume
          </a>
        </div>
      )}

      <button
        className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        onClick={() => navigate("/employee-dashboard/profile")}
      >
        ✏️ Chỉnh sửa hồ sơ
      </button>
    </div>
  );
};

export default ViewProfile;
