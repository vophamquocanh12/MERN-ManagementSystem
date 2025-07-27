// routes/analyticsRoutes.js
import express from "express";
import {
  getLeavesPerMonth,
  getDashboardStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/leaves-per-month", getLeavesPerMonth);
router.get("/dashboard-stats", getDashboardStats); 

export default router;
