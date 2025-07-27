// frontend/src/pages/departments/Departments.jsx
import React, { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingDept, setEditingDept] = useState(null);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingDept) {
      await updateDepartment(editingDept._id, { name });
    } else {
      await addDepartment({ name });
    }
    setName("");
    setEditingDept(null);
    fetchDepartments();
  };

  const handleEdit = (dept) => {
    setName(dept.name);
    setEditingDept(dept);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDepartment(id);
      fetchDepartments();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department name"
          className="border p-2 flex-1 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingDept ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {departments.map((dept) => (
          <li key={dept._id} className="bg-gray-100 p-2 rounded flex justify-between">
            <span>{dept.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(dept)}
                className="text-blue-600 underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dept._id)}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Departments;
