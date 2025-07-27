// src/components/dashboard/AdminHeader.jsx
import NotificationBell from "./NotificationBell";

const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">Admin Panel</h1>
      <NotificationBell />
    </header>
  );
};

export default AdminHeader;
