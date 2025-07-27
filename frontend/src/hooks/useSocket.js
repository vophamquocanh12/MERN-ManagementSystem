// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Always use env-based socket URL
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export const useSocket = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handler = (data) => setMessages((prev) => [...prev, data.message]);

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, []);

  return { messages };
};
