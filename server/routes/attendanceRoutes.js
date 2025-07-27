import express from 'express';
import Attendance from '../models/Attendance.js';
import verifyToken, { verifyRole } from '../middleware/authMiddleware.js';
import moment from 'moment';
import {
  markByAdmin,
  markByEmployee,
  getAllAttendance,
  getOwnAttendance,
  getAttendanceTrend,
  getAttendanceSummary, // 🆕 For pie chart
  getAttendanceStats, // 🆕 For bar chart
  } from "../controllers/attendanceController.js";

const router = express.Router();

// Admin marks any employee
router.post("/", verifyToken, verifyRole("admin"), markByAdmin);

// Employee marks self
router.post("/mark", verifyToken, markByEmployee);

// Admin filters by employee/month
router.get("/", verifyToken, verifyRole("admin"), getAllAttendance);

// Employee sees their records
router.get("/my", verifyToken, getOwnAttendance);

// Attendance trend chart
router.get("/trends", verifyToken, verifyRole("admin"), getAttendanceTrend);

// 🆕 Pie chart summary
router.get("/summary", verifyToken, verifyRole("admin"), getAttendanceSummary);

// 🆕 Bar chart stats
router.get("/stats", verifyToken, verifyRole("admin"), getAttendanceStats);


export default router;