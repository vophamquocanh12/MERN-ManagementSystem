// routes/employeeRoutes.js
import express from "express";
import verifyToken, { verifyRole } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { uploadMemory, uploadDisk } from "../config/multer.js";
import {
  createEmployee,
  updateEmployeeProfile,
  getAllEmployees,
  updateAnyEmployeeProfile,
  deleteEmployee,
  getOwnEmployeeProfile,
  getEmployeeById,
  uploadResume,
  getResumeById,
  getEmployeeAnalytics,
} from "../controllers/employeeController.js";

const router = express.Router();

// ✅ Admin Get All Employees
router.get("/", verifyToken, verifyRole("admin"), getAllEmployees);

// ✅ Create Employee (Admin only)
router.post("/", verifyToken, verifyRole("admin"), createEmployee);

// ✅ Get Own Profile (Employee)
router.get("/me", verifyToken, getOwnEmployeeProfile);

// ✅ Update Own Profile (Employee) - with photo
router.put("/profile", verifyToken, uploadMemory.single("photo"), updateEmployeeProfile);

// ✅ Admin Delete Employee
router.delete("/:id", verifyToken, verifyRole("admin"), deleteEmployee);

// ✅ Upload Resume (Admin or Employee)
router.put("/upload-resume/:id", verifyToken, uploadMemory.single("resume"), uploadResume);

// ✅ View Resume
router.get("/resume/:id", verifyToken, getResumeById);

// ✅ Get Employee Analytics (Admin only)
router.get("/analytics", verifyToken, verifyRole("admin"), getEmployeeAnalytics);

// ✅ Admin Update Any Employee
router.put("/:id", verifyToken, verifyRole("admin"), uploadMemory.single("photo"), updateAnyEmployeeProfile);

// ✅ Get Employee By ID (Admin only)
router.get("/:id", verifyToken, verifyRole("admin"), getEmployeeById);


export default router;
