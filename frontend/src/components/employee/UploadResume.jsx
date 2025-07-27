// src/components/employee/UploadResume.jsx
import React, { useState } from "react";
import api from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadResume = ({ employeeId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a resume file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      setUploading(true);
      await api.put(`/employees/upload-resume/${employeeId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("📄 Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded">
      <h2 className="text-lg font-semibold mb-4">Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-4 block w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UploadResume;
