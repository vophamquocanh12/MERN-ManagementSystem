// src/components/attendance/AttendanceTable.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import api from "@/services/api";

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/attendance");
        setRecords(data.records);
        setFiltered(data.records);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch attendance records.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      records.filter((r) =>
        r.employee?.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, records]);

  const columns = [
    { name: "Employee", selector: row => row.employee?.name || "N/A", sortable: true },
    { name: "Email", selector: row => row.employee?.email || "N/A" },
    { name: "Date", selector: row => new Date(row.date).toLocaleDateString(), sortable: true },
    {
      name: "Status",
      cell: row => (
        <span className={`px-2 py-1 rounded text-white ${
          row.status === "Present"
            ? "bg-green-500"
            : row.status === "Absent"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}>
          {row.status}
        </span>
      ),
    },
    { name: "Remarks", selector: row => row.remarks || "-" },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendance Records</h2>
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
};

export default AttendanceTable;
