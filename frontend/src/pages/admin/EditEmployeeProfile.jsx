import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";


const EditEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    resumeUrl: "",
    skills: [],
  });
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [inputSkill, setInputSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setForm({
          name: data.user.name,
          email: data.user.email,
          bio: data.employee?.bio || "",
          resumeUrl: data.employee?.resumeUrl || "",
          skills: data.employee?.skills || [],
        });
      } catch (err) {
        console.error("❌ Failed to fetch employee:", err);
        alert("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputSkill.trim();
      if (trimmed && !form.skills.includes(trimmed)) {
        setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      }
      setInputSkill("");
    }
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("bio", form.bio);
      formData.append("skills", JSON.stringify(form.skills));
      if (photo) formData.append("photo", photo);

      await api.put(`/api/employees/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("✅ Profile updated!");
      navigate("/admin-dashboard/employees");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update profile");
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) return alert("Please select a resume file first.");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await api.put(
        `/api/employees/upload-resume/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("📄 Resume uploaded successfully!");
      setForm((prev) => ({ ...prev, resumeUrl: data.resumeUrl }));
    } catch (err) {
      console.error("❌ Resume upload error:", err);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Employee Profile</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="input mb-3 w-full"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="input mb-3 w-full"
        placeholder="Email"
      />
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        className="input mb-3 w-full"
        placeholder="Short bio"
      />

      {/* 🏷️ Skills Input */}
      <label className="block font-medium mb-1">Skills</label>
      <input
        type="text"
        value={inputSkill}
        onChange={(e) => setInputSkill(e.target.value)}
        onKeyDown={handleSkillKeyDown}
        placeholder="Type skill and press Enter"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {form.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="ml-2 text-red-500"
            >
              ❌
            </button>
          </span>
        ))}
      </div>

      {/* 📸 Photo Upload */}
      <label className="block font-medium mb-1">Profile Photo</label>
      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
        accept="image/*"
        className="mb-4"
      />

      {/* 📄 Resume Upload */}
      <label className="block font-medium mb-1">Upload Resume (PDF/DOCX)</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleResumeUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {/* 📎 Download Resume Link */}
      {form.resumeUrl && (
        <div className="mb-4">
          <a
            href={form.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm"
          >
            📄 View Uploaded Resume
          </a>
        </div>
      )}

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditEmployeeProfile;
