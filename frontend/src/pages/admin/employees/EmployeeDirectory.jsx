import React, { useEffect, useState } from "react";
import api from "@/services/api";

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get("/api/employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const filtered = employees
    .filter((emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((emp) =>
      !filterDept || emp.department?.name === filterDept
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(a.dateJoined) - new Date(b.dateJoined);
      return 0;
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">👥 Employee Directory</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        />

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date Joined</option>
        </select>
      </div>

      {/* 👤 Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          filtered.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded shadow p-4 flex flex-col items-center text-center"
            >
              <img
                src={`/uploads/${emp.image || "default.png"}`}
                alt={emp.name}
                className="w-24 h-24 object-cover rounded-full mb-3"
              />
              <h4 className="text-lg font-semibold">{emp.name}</h4>
              <p className="text-sm text-gray-600">{emp.email}</p>
              <p className="text-sm text-gray-600">
                {emp.department?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Joined: {emp.dateJoined ? new Date(emp.dateJoined).toLocaleDateString() : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
