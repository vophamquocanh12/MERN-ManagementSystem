import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import EmployeeSidebar from "../components/employee/EmployeeSidebar";
import EmployeeNavbar from "../components/employee/EmployeeNavbar";
import EmployeeSummary from "../components/dashboard/EmployeeSummary"; // ✅ Welcome dashboard

const EmployeeDashboard = () => {
  const location = useLocation();
  const isRootDashboard = location.pathname === "/employee-dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <EmployeeSidebar />

      {/* Main Panel */}
      <div className="flex-1 ml-64 flex flex-col">
        <EmployeeNavbar />

        <div className="flex-1 overflow-y-auto p-4">
          {/* Show dashboard summary by default, or load nested route */}
          {isRootDashboard ? <EmployeeSummary /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
