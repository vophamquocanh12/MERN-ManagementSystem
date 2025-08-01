import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import DashboardCharts from "./DashboardCharts";
import { getAdminDashboardStats } from "../../services/dashboardService";
import {
  FaUsers,
  FaBuilding,
  FaMoneyCheckAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const AdminSummary = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin dashboard stats:", err);
        setError("⚠️ Failed to load dashboard data. Please try again.");
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-gray-500 text-lg font-medium">
        Loading admin dashboard...
      </div>
    );
  }

  const summaryData = [
    {
      icon: <FaUsers />,
      label: "Total Employees",
      count: stats.employeesCount,
      color: "bg-teal-500",
    },
    {
      icon: <FaBuilding />,
      label: "Departments",
      count: stats.departmentsCount,
      color: "bg-yellow-500",
    },
    {
      icon: <FaMoneyCheckAlt />,
      label: "Total Salary Payable",
      count: `£${stats.totalSalay?.toLocaleString() ?? 0}`,
      color: "bg-purple-500",
    },
    {
      icon: <FaCalendarCheck />,
      label: "Approved Leaves",
      count: stats.approvedLeaves,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Overview</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      <DashboardCharts />
    </div>
  );
};

export default AdminSummary;
