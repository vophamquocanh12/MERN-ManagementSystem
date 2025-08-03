// src/components/dashboard/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaCogs,
  FaFolderOpen,
  FaCalendarAlt,
  FaChartPie
} from "react-icons/fa";

const AdminSidebar = () => {
  const navItems = [
    { label: "Tổng quan", icon: <FaTachometerAlt />, to: "/admin-dashboard" },
    { label: "Nhân viên", icon: <FaUsers />, to: "/admin-dashboard/employees" },
    { label: "Phòng ban", icon: <FaBuilding />, to: "/admin-dashboard/departments" },
    //{ label: "Leave", icon: <FaCalendarAlt />, to: "/admin-dashboard/leaves" },
    { label: "Lương", icon: <FaMoneyBillWave />, to: "/admin-dashboard/salary" },
    //{ label: "Analytics", icon: <FaChartPie />, to: "/admin-dashboard/employee-analytics" },
    //{ label: "Documents", icon: <FaFolderOpen />, to: "/admin-dashboard/files" },
    //{ label: "File Manager", icon: <FaFolderOpen />, to: "/admin-dashboard/file-manager" },
    //{ label: "Settings", icon: <FaCogs />, to: "/admin-dashboard/settings" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col py-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Quản lý nhân viên</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={["/admin-dashboard"].includes(item.to)}
            className={({ isActive }) =>
              `flex items-center px-6 py-2 hover:bg-gray-700 ${
                isActive ? "bg-teal-500" : ""
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
