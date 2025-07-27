// controllers/fileController.js
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "ems-files" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const newFile = new File({
      name: req.file.originalname,
      type: req.file.mimetype,
      url: result.secure_url,
      uploadedBy: req.user._id,
    });

    await newFile.save();
    res.status(201).json({ success: true, file: newFile });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export const getAllFiles = async (req, res) => {
  const files = await File.find().populate("uploadedBy", "name").sort({ createdAt: -1 });
  res.json({ success: true, files });
};

export const getAllEmployeeFiles = async (req, res) => {
  try {
    const employees = await Employee.find({ resumeUrl: { $exists: true, $ne: null } })
      .populate("user", "name");

    const files = employees.map((emp) => ({
      _id: emp._id,
      name: emp.user?.name || "Unnamed",
      resumeUrl: emp.resumeUrl,
    }));

    res.status(200).json({ success: true, data: files });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ success: false, error: "Failed to load files" });
  }
};
