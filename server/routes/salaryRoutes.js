// backend/routes/salaryRoutes.js
import express from "express";
import Salary from "../models/Salary.js";
import verifyToken, { verifyRole } from "../middleware/authMiddleware.js";
import {
  createSalaryRecord,
  getAllSalaries,
  getSalaryByEmployee,
  getMonthlyPayrollSummary,
  getPayrollByDepartment,
  getMonthlySalaryStats,
  updateSalaryRecord,
  getSalaryStats,
  deleteSalaryRecord,

} from "../controllers/salaryController.js";

const router = express.Router();

// POST /api/salaries - Admin creates salary record
router.post("/", verifyToken, verifyRole("admin"), createSalaryRecord);

// PUT /api/salaries/:id - Admin updates salary record
router.put("/:id", verifyToken, verifyRole("admin"), updateSalaryRecord);

// DELETE /api/salaries/:id - Admin deletes salary record
router.delete("/:id", verifyToken, verifyRole("admin"), deleteSalaryRecord);

// GET /api/salaries - Admin views all
router.get("/", verifyToken, verifyRole("admin"), getAllSalaries);

// GET /api/salaries/my - Employee views own
router.get("/my", verifyToken, getSalaryByEmployee);

// GET /api/salaries/summary - Admin chart data
router.get("/summary", verifyToken, verifyRole("admin"), getMonthlyPayrollSummary);

// GET /api/salaries/department - Admin chart data
router.get("/summary-by-department", verifyToken, verifyRole("admin"), getPayrollByDepartment);


router.get("/salary-stats", verifyToken, verifyRole("admin"), getMonthlySalaryStats);

router.get("/stats", verifyToken, verifyRole("admin"), getSalaryStats);


export default router;
