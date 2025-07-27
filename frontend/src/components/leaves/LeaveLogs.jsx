// src/components/leaves/LeaveLogs.jsx
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const LeaveLogs = ({ leaves }) => {
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredLeaves = useMemo(() => {
    return leaves.filter((log) => {
      const logDept = log.employee?.department || "";
      const logStatus = log.status?.toLowerCase();
      const logDate = new Date(log.startDate);

      return (
        (!department || logDept === department) &&
        (!status || logStatus === status.toLowerCase()) &&
        (!startDate || logDate >= new Date(startDate)) &&
        (!endDate || logDate <= new Date(endDate))
      );
    });
  }, [leaves, department, status, startDate, endDate]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Leave Logs Report", 14, 16);
    doc.autoTable({
      startY: 22,
      head: [["Employee", "Reason", "Status", "From", "To"]],
      body: filteredLeaves.map((leave) => [
        leave.employee?.name,
        leave.reason,
        leave.status,
        new Date(leave.startDate).toLocaleDateString(),
        new Date(leave.endDate).toLocaleDateString(),
      ]),
    });
    doc.save("leave-logs.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLeaves.map((leave) => ({
        Employee: leave.employee?.name,
        Reason: leave.reason,
        Status: leave.status,
        From: new Date(leave.startDate).toLocaleDateString(),
        To: new Date(leave.endDate).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Logs");
    XLSX.writeFile(workbook, "leave-logs.xlsx");
  };

  return (
    <div className="space-y-6 mt-4">
      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          onChange={(e) => setDepartment(e.target.value)}
          value={department}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>

        <select
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
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
      </div>

      {/* 📄 Table */}
      <div className="overflow-x-auto shadow border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Reason</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">From</th>
              <th className="p-2 text-left">To</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
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

      {/* 📤 Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleExportPDF}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default LeaveLogs;
