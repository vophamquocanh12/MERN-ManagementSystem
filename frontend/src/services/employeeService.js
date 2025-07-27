import api from "./api";

export const updateProfile = async (formData) => {
  const { data } = await api.put("/employees/profile", formData);
  return data;
};

export const updateEmployeeById = async (id, formData) => {
  const { data } = await api.put(`/employees/${id}`, formData);
  return data;
};

export const getEmployeeById = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return data;
};
