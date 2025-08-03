import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserAlt,
  FaCalendarCheck,
  FaCalendarAlt,
  FaMoneyBill,
  FaCogs,
  FaEye,
} from "react-icons/fa";

const EmployeeSidebar = () => {
  const navItems = [
    { label: "Tổng quan", icon: <FaCalendarAlt />, to: "/employee-dashboard" },
    { label: "Hồ sơ", icon: <FaUserAlt />, to: "/employee-dashboard/profile" },
    {
      label: "Xem hồ sơ",
      icon: <FaEye />,
      to: "/employee-dashboard/profile/view",
    },
    //{ label: "Leave", icon: <FaCalendarCheck />, to: "/employee-dashboard/leave" },
    { label: "Lương", icon: <FaMoneyBill />, to: "/employee-dashboard/salary" },
    //{ label: "Attendance Heatmap", icon: <FaCalendarAlt />, to: "/employee-dashboard/attendance-heatmap" },
    //{ label: "Settings", icon: <FaCalendarAlt />, to: "/employee-dashboard/settings" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white py-6 space-y-6">
      <h2 className="text-center text-xl font-bold">Nhân viên</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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

export default EmployeeSidebar;
