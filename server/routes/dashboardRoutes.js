import express from "express";
import { getAdminStats } from "../controllers/dashboardController.js";
import verifyToken from "../middleware/authMiddleware.js"; 


const router = express.Router();

router.get("/admin-stats", verifyToken, getAdminStats);

export default router;
