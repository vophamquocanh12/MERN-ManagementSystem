// src/pages/admin/AdminFileDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";

const AdminFileDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await api.get("/files/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFiles(data.data);
      } catch (err) {
        console.error("❌ Failed to fetch files:", err);
        alert("Failed to load files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div className="p-6">Loading files...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📁 Uploaded Resumes</h2>
      {files.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((emp) => (
            <div key={emp._id} className="border rounded p-4 shadow bg-white">
              <h4 className="font-semibold mb-2">{emp.name}</h4>
              <a
                href={emp.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm"
              >
                📄 View Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFileDashboard;
