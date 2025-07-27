import api from "./api"; // Axios instance with token header

export const getAdminDashboardStats = async () => {
  const { data } = await api.get("/dashboard/admin-stats");
  return data.data;
};
