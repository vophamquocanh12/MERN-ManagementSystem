// src/pages/departments/AddDepartment.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import useAuth from "../../contexts/useAuth";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/departments/add`,
        department,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      console.error("Error adding department:", error?.response?.data?.error);
      alert(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Department</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Department Name</label>
          <input
            type="text"
            name="name"
            value={department.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded shadow-sm focus:ring"
            placeholder="e.g. Human Resources"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={department.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded shadow-sm focus:ring"
            placeholder="Brief description of the department"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Department"}
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
