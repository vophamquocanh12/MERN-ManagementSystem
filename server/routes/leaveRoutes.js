// routes/leaveRoutes.js
import express from "express";
import verifyToken, { verifyRole } from "../middleware/authMiddleware.js";
import {
  approveLeave,
  getApprovedLeaves,
  requestLeave,
  getLeaveById,
  getLeaves,
  getAllLeaves,
  getLeavesByEmployee,
  updateLeaveStatus,
  getLeaveTrends,
  getLeaveStats,
  exportLeavesToExcel,
  getMyLeaveSummary,
} from "../controllers/leaveController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ✅ My summary route (place before `/:id`)
router.get("/my-summary", verifyToken, getMyLeaveSummary);

// ✅ Submit leave request (with document upload)
router.post("/", verifyToken, upload.single("document"), requestLeave);

// ✅ Approve/reject leave
router.put("/approve", verifyToken, verifyRole("admin"), approveLeave);

// ✅ Fetch all/paginated leaves
router.get("/", verifyToken, verifyRole("admin"), getLeaves);

// ✅ All leaves for admin
router.get("/all", verifyToken, verifyRole("admin"), getAllLeaves);

// ✅ Get approved leaves (calendar)
router.get("/calendar", verifyToken, verifyRole("admin"), getApprovedLeaves);

// ✅ Trends for charts
router.get("/trends", verifyToken, verifyRole("admin"), getLeaveTrends);

// ✅ Stats for dashboard
router.get("/leave-stats", verifyToken, verifyRole("admin"), getLeaveStats);

// ✅ Excel export
router.get("/export", verifyToken, verifyRole("admin"), exportLeavesToExcel);

// ✅ Get leaves by employee
router.get("/employee/:employeeId", verifyToken, getLeavesByEmployee);

// ✅ Get leave by ID
router.get("/:id", verifyToken, getLeaveById);

// ✅ Update status manually
router.put("/:id/status", verifyToken, verifyRole("admin"), updateLeaveStatus);



export default router;
