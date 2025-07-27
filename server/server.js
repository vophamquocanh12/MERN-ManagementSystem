import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";



// Background job
import "./jobs/dailySummaryJob.js";

// Real-time server
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app", // ✅ Replace with actual frontend URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Export io for other modules
export { io };

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-employee-management-system.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🚫 A user disconnected:", socket.id);
  });
});

// Listen
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ API + Socket.IO server running on http://localhost:${PORT}`);
});

/*
ENDPOINT
1. Đăng ký tài khoản mới
2. Đăng nhập
3. Tạo nhân viên mới (admin only)
4. Lấy danh sách nhân viên
5. Cập nhật nhân viên
6. Xóa nhân viên
7. Upload ảnh (nếu có)
8. Tìm kiếm nhân viên (admin only)
9. Tạo phòng ban
10. Cập nhật phòng ban
11. Xóa phòng ban
*/ 