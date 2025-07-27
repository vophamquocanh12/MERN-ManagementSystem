// src/components/shared/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">EMS</Link>
      <ul className="flex items-center space-x-4 text-gray-700">
        <li><Link to="/admin-dashboard/employees">Employees</Link></li>
        <li><Link to="/admin-dashboard/departments">Departments</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
