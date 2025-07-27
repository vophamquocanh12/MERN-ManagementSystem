// server/config/multer.js
import multer from "multer";
import path from "path";

// File filter for common file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and Word documents are allowed"));
  }
};

// ✅ Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// ✅ Disk storage for local file system
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 🔄 Export both types
export const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export const uploadDisk = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
