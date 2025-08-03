import React from "react";
import useAuth from "../../contexts/useAuth";

const EmployeeNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-teal-600 text-white px-6 py-3 flex justify-between items-center">
      <h3 className="text-lg">Xin chào, {user?.name || "Employee"}</h3>
      <button
        onClick={logout}
        className="bg-white text-teal-700 px-4 py-1 rounded hover:bg-teal-100"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default EmployeeNavbar;
