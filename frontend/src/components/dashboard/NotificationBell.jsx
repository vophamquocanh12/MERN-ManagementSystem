import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications?role=admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifs(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <FaBell className="text-white text-xl" />
      {notifs.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
          {notifs.length}
        </span>
      )}
      {/* Optional: Dropdown or modal for notification list */}
    </div>
  );
};

export default NotificationBell;
