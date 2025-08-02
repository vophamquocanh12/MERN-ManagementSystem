import api from "./api";

export const createSalaryRecord = async (data) => {
    const res = await api.post("/salaries", data);
    return res.data;
}

export const updateSalaryRecord = async (id, data) => {
  const res = await api.put(`/salaries/${id}`, data);
  return res.data;
};

export const deleteSalaryRecord = async (id) => {
  const res = await api.delete(`/salaries/${id}`);
  return res.data;
}

export const getAllSalaries = async () => {
    const res = await api.get("/salaries");
    return res.data.salaries;
}

export const getSalaryByEmployee = async () => {
  const res = await api.get("/salaries/my");
  return res.data.salaries;
};

export const getMonthlyPayrollSummary = async () => {
  const res = await api.get("/salaries/summary");
  return res.data;
}

export const getPayrollByDepartment = async () => {
  const res = await api.get("/salaries/summary-by-department");
  return res.data;
}
export const getMonthlySalaryStats = async () => {
  const res = await api.get("/salaries/salary-stats");
  return res.data;
}
export const getSalaryStats = async () => {
  const res = await api.get("/salaries/stats");
  return res.data;
}