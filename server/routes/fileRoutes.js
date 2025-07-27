// routes/fileRoutes.js
import express from "express";
import multer from "multer";
import verifyToken, { verifyRole, isAdminOrHR } from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/fileController.js";
import { getAllEmployeeFiles, getAllFiles } from "../controllers/fileController.js";
import { canViewFile } from "../middleware/fileAccess.js";

const router = express.Router();

// 🆕 File upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// ✅ Root route: GET /api/files - Admin/HR fetch all uploaded files
router.get("/", verifyToken, isAdminOrHR, getAllFiles);

// ✅ Admin: View all employee resumes - GET /api/files/all
router.get("/all", verifyToken, verifyRole("admin"), getAllEmployeeFiles);

// ✅ Employee: View single resume by ID
router.get("/file/:id", verifyToken, canViewFile, (req, res) => {
  res.json({ success: true, file: req.fileRecord });
});

router.get("/files", verifyToken, getAllFiles);
router.get("/file/:id", verifyToken, canViewFile, (req, res) => {
  res.json({ success: true, file: req.fileRecord });
});
router.get("/all", verifyToken, getAllEmployeeFiles);

export default router;
