// server/routes/departmentRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsWithCount,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/", authMiddleware, addDepartment);
router.get("/", authMiddleware, getDepartments);
router.get("/with-count", authMiddleware, getDepartmentsWithCount);
router.get("/:id", authMiddleware, getDepartment);
router.put("/:id", authMiddleware,  updateDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
