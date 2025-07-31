import api from "./api";

export const updateProfile = async (formData) => {
  const { data } = await api.put("/employees/profile", formData);
  return data;
};

// export const updateEmployeeById = async (id, formData) => {
//   const { data } = await api.put(`/employees/${id}`, formData);
//   return data;
// };


// API getAllEmployees (admin only)
// Lấy danh sách tất cả nhân viên
export const getAllEmployees = async () => {
  const res = await api.get("/employees");
  return res.data.employees;
}

// API searchEmployeesByName (admin only)
// Tìm kiếm nhân viên theo tên
export const searchEmployeesByName = async (name) => {
  const res = await api.get(`/employees/search?name=${name}`); 
  return res.data.employees;
}

// API getEmployeeById (admin only)
// Lấy thông tin nhân viên theo ID
export const getEmployeeById = async (id) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
}

// API createEmployee (admin only)
// Tạo mới nhân viên
export const createEmployee = async (data) => {
  const res = await api.post("/employees", data);
  return res.data;
}

// API updateAnyEmployeeProfile (admin only)
// Cập nhật thông tin nhân viên theo ID
export const updateAnyEmployeeProfile = async (id, data) => {
  const res = await api.put(`/employees/${id}`, data);
  return res.data;
};

// API deleteEmployee (admin only)
// Xóa nhân viên theo ID
export const deleteEmployee = async (id) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data.employees;
}

// API updateOwnProfile (employee)
// Cập nhật thông tin cá nhân của nhân viên
export const updateEmployeeProfile = async (data, file) => {
  const formDate = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formDate.append(key, value);
  });
  if (file) {
    formDate.append("file", file);
  }
  const res = await api.put("/employees/profile", formDate, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// API getOwnEmployeeProfile (employee)
// Lấy thông tin cá nhân của nhân viên
export const getOwnEmployeeProfile = async () => {
  const res = await api.get("/employees/me");
  return res.data;
}

// API getEmployeeAnalytics (admin only)
// Lấy thống kê nhân viên
export const getEmployeeAnalytics = async () => {
  const res = await api.get("/employees/analytics");
  return res.data;
}
