// ✅ LeaveList.jsx (with export to PDF/Excel)
import React, { useEffect, useState, useMemo } from "react";
import api from "@/services/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get("/api/leaves", {
          params: { search, status, page, limit },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLeaves(res.data.leaves);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };
    fetchLeaves();
  }, [search, status, page]);

  const memoizedLeaves = useMemo(() => leaves, [leaves]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🗃️ Leave Logs</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by reason"
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          onClick={() => exportToExcel(memoizedLeaves, "leave_report.xlsx")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >Export Excel</button>
        <button
          onClick={() => exportToPDF(memoizedLeaves, "Leave Report")}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >Export PDF</button>
      </div>

      <div className="overflow-x-auto shadow border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Reason</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
            </tr>
          </thead>
          <tbody>
            {memoizedLeaves.map((leave) => (
              <tr key={leave._id} className="border-t">
                <td className="p-2">{leave.employee?.name}</td>
                <td className="p-2">{leave.employee?.department || "N/A"}</td>
                <td className="p-2">{leave.reason}</td>
                <td className="p-2 capitalize">
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
                <td className="p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default LeaveList;
