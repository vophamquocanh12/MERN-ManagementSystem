// src/pages/admin/AdminLeavePage.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/services/api";
import LeaveLogs from "../../components/leaves/LeaveLogs";

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leaves", {
        params: { search: searchTerm, status: selectedStatus, page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLeaves(data.leaves);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, page]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleExportBackend = () => {
    const url = `/api/leaves/export?search=${searchTerm}&status=${selectedStatus}`;
    window.open(url, "_blank");
  };

  // 🧠 Apply client-side filtering
  const filteredLeaves = useMemo(() => {
    return leaves.filter((log) => {
      const logDept = log.employee?.department || "";
      const logStatus = log.status?.toLowerCase();
      const logDate = new Date(log.startDate);

      return (
        (!selectedDept || logDept === selectedDept) &&
        (!selectedStatus || logStatus === selectedStatus.toLowerCase()) &&
        (!startDate || logDate >= new Date(startDate)) &&
        (!endDate || logDate <= new Date(endDate))
      );
    });
  }, [leaves, selectedDept, selectedStatus, startDate, endDate]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Manage Leave Requests</h2>

      {/* 🔍 Filter Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleExportBackend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export from Backend
        </button>
      </div>

      {/* 🧾 Leave Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading leaves...</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2 text-left">End</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="border-t">
                    <td className="p-2">{leave.employee?.name}</td>
                    <td className="p-2">{leave.employee?.department || "N/A"}</td>
                    <td className="p-2">{leave.startDate?.slice(0, 10)}</td>
                    <td className="p-2">{leave.endDate?.slice(0, 10)}</td>
                    <td className="p-2">{leave.reason}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📤 Export PDF/Excel (Client-side) */}
          <LeaveLogs leaves={filteredLeaves} />

          {/* 📄 Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLeavePage;
