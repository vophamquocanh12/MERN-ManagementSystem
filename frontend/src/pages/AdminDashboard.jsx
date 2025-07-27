// src/pages/dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import api from "@/services/api";

import AdminSidebar from "../components/dashboard/AdminSidebar";
import AdminNavbar from "../components/dashboard/AdminNavbar";
import AdminSummary from "../components/dashboard/AdminSummary";
import Charts from "../components/admin/Charts";
import LeaveChart from "../components/dashboard/LeaveChart";
import DepartmentChart from "../components/charts/DepartmentChart";
import AttendanceOverview from "../components/charts/AttendanceOverview";

const AdminDashboard = () => {
  const location = useLocation();
  const isRootDashboard = location.pathname === "/admin-dashboard";

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const chartData = res.data.departments.map((dept) => ({
          department: dept.name,
          count: dept.employeeCount || 1,
        }));

        setDepartments(chartData);
      } catch (err) {
        console.error("Error loading department data:", err);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto p-4">
          {isRootDashboard ? (
            <>
              <AdminSummary />
              <Charts />
              <LeaveChart />
              {departments.length > 0 && <DepartmentChart data={departments} />}
              <AttendanceOverview /> {/* ✅ NEW: Attendance % + Present/Absent chart */}
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
