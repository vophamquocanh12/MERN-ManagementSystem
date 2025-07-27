// src/pages/admin/FileManager.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileWord, FaFileExcel, FaUpload, FaSearch, FaFileAlt } from "react-icons/fa";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils"; // Ensure this utility exists

const getFileIcon = (type = "") => {
  if (type.includes("pdf")) return <FaFilePdf className="text-red-600" />;
  if (type.includes("word")) return <FaFileWord className="text-blue-600" />;
  if (type.includes("excel")) return <FaFileExcel className="text-green-600" />;
  return <FaFileAlt className="text-gray-500" />;
};

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles(res.data.files);
      setFilteredFiles(res.data.files);
    } catch {
      setError("❌ Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFiles();
    } catch {
      alert("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      name: "Type",
      selector: (row) => getFileIcon(row.type),
      width: "60px",
    },
    {
      name: "Filename",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Uploader",
      selector: (row) => row.uploadedBy?.name || "N/A",
    },
    {
      name: "Download",
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">📂 Document Manager</h2>

      <div className="flex items-center gap-3">
        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          <FaUpload className="inline mr-2" /> Upload
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <button
          onClick={() => exportToExcel(filteredFiles, "documents.xlsx")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

        <button
          onClick={() => exportToPDF(filteredFiles, "Documents Report")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>

        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search files..."
            className="pl-10 pr-4 py-2 border rounded w-full"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredFiles}
          pagination
          highlightOnHover
          responsive
        />
      )}
    </div>
  );
};

export default FileManager;
