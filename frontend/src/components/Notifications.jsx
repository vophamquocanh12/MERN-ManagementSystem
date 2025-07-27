// src/components/shared/Notifications.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";

const Notifications = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get("/notifications");
        setMessages(data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifs();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Notifications</h3>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications available.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg, i) => (
            <li key={i} className="bg-yellow-100 p-2 rounded">{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
