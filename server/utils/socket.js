// Backend: Socket Setup (utils/socket.js)
import { Server } from "socket.io";

let io;
export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => console.log("🟢 Socket connected"));
  return io;
};
export const getIO = () => io;

