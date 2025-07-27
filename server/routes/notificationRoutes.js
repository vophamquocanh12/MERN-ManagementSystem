import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

export default router;
