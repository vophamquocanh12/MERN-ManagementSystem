/* eslint-disable no-unused-vars */
// src/pages/admin/EmployeeList.jsx
import { useState, useEffect } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setModalOpen(true);
  };

  const colums =[
    {name: "#", selector: (row, i) => i + 1, withh: "60px"},
    {name: "Name", selector: (row) => row.name, sortable: true},
    {name: "Email", selector: (row) => row.email, sortable: true}
  ]

  return (
    // <div className="p-4">
    //   <h2 className="text-2xl font-semibold mb-4">All Employees</h2>
    //   {/* Replace with actual employee fetching logic */}
    //   <p>Employee list will show here...</p>
    // </div>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Employees</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <div className="flex gap-3">
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
            + Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
