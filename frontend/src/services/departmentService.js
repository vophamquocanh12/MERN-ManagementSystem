// 📁 frontend/src/services/departmentService.js
import api from "./api";

// Get all departments
export const getDepartments = async () => {
  const res = await api.get("/departments");
  return res.data.departments;
};

// Add a new department
export const addDepartment = async (data) => {
  await api.post("/departments", data);
};

// Update a department by ID
export const updateDepartment = async (id, data) => {
  await api.put(`/departments/${id}`, data);
};

// Delete department by ID
export const deleteDepartment = async (id) => {
  await api.delete(`/departments/${id}`);
};
