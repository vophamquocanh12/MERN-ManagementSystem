import bcrypt from "bcryptjs";
import fs from "fs";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import Notification from "../models/notificationModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import path from "path";
import { log } from "console";

// ✅ 1. Create New Employee (Admin Only)
export const createEmployee = async (req, res) => {
  // try {
  //   const { name, email, department, password, role } = req.body;

  //   const hashed = await bcrypt.hash(password, 10);

  //   const newUser = await User.create({
  //     name,
  //     email,
  //     password: hashed,
  //     role,
  //     department,
  //   });

  //   res.status(201).json({ success: true, user: newUser });
  // } catch (err) {
  //   console.error("Employee creation error:", err);
  //   res.status(500).json({ success: false, error: err.message });
  // }
  try {
    const { name, email, password, department, position, salary } = req.body;
    if (!name || !email || !password || !department || !position || !salary) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: "employee", // default role
      department,
      position,
      salary,
    });
     res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Employee creation error:", err);
   res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 2. Employee Updates Their Own Profile
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;
    const userId = req.user._id;

    let photoUrl = null;
    if (req.file && req.file.buffer) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ems_profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      photoUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    const employee = await Employee.findOneAndUpdate(
      { user: userId },
      { bio, skills, ...(photoUrl && { photoUrl }) },
      { new: true, upsert: true }
    );

    // ✅ Send Notification
    await Notification.create({
      message: `${user.name} updated their profile`,
      type: "info",
      targetRole: "admin",
    });

    res.status(200).json({ success: true, user, employee });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

// ✅ 3. Admin Updates Any Employee’s Profile
export const updateAnyEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params; // Employee's user ID
    const { name, email, bio } = req.body;

    let photoUrl = null;
    if (req.file && req.file.buffer) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ems_profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      photoUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const employee = await Employee.findOneAndUpdate(
      { user: id },
      { bio, ...(photoUrl && { photoUrl }) },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, user, employee });
  } catch (error) {
    console.error("Admin profile update error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};
// ✅ 4. Get employee list (admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Get employees error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ✅ 5. Admin Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Kiểm tra xem user tồn tại và có phải employee không
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "employee") {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found." });
    }

    await User.findByIdAndDelete(employeeId);

    res.status(200).json({ success: true, message: "Employee deleted successfully." });
  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 6. Admin Search Employees by Name
export const searchEmployeesByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: "Missing name query parameter." });
    }

    // Tìm những user có role là "employee" và tên khớp (không phân biệt hoa thường)
    const employees = await User.find({
      role: "employee",
      name: { $regex: name, $options: "i" }, // i: ignore case
    });

    res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Search employee error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const resultUrl = await uploadToCloudinary(fileBuffer);

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { resumeUrl: resultUrl },
      { new: true }
    );

    res.status(200).json({ success: true, resumeUrl: resultUrl });
  } catch (err) {
    console.error("❌ Resume upload error:", err);
    res.status(500).json({ success: false, error: "Resume upload failed" });
  }
};

// ✅ Analytics Data: Gender + Department Count
export const getEmployeeAnalytics = async (req, res) => {
  try {
    const genderStats = await Employee.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ genderStats, departmentStats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ View Resume by User ID (Admin or Self)
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin or the user themselves
    if (req.user.role !== "admin" && req.user._id !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const employee = await Employee.findOne({ user: id });
    if (!employee || !employee.resumeUrl) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({ success: true, resumeUrl: employee.resumeUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve resume" });
  }
};

// ✅ Get Own Employee Profile (Employee Only)
export const getOwnEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    const employee = await Employee.findOne({ user: userId }).populate({
      path: "department",
      strictPopulate: false,
    }); // ✅ this is key

    if (!user || !employee) {
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    }

    res.status(200).json({ success: true, user, employee });
  } catch (error) {
    console.error("Error in getOwnEmployeeProfile:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve profile" });
  }
};

// ✅ Get Employee by ID (Admin)
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy thông tin User
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Lấy thông tin Employee liên kết với user
    const employee = await Employee.findOne({ user: id })
      .populate("department", "name") // chỉ lấy trường name trong Department
      .populate("attendance") // có thể giới hạn các field nếu muốn
      .populate("salary");
      
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee profile not found" });
    }

    return res.status(200).json({
      success: true,
      user,
      employee,
    });
  } catch (error) {
    console.error("❌ Error in getEmployeeById:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve employee" });
  }
};
