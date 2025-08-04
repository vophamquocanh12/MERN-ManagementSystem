import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import Notification from "../models/notificationModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import path from "path";

// ✅ 1. Create New Employee (Admin Only)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, gender, skills } = req.body;
    if (!name || !email || !password || !department || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại." });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: "employee", // default role
    });
    await newUser.save();

    // Create Employee
    const newEmployee = await Employee.create({
      user: newUser._id,
      department,
      gender,
      bio: req.body.bio || "",
      skills: req.body.skills || [],
    });

    await newEmployee.save();
    res.status(201).json({ success: true, employee: newEmployee });
  } catch (error) {
    console.error("Employee creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ 2. Employee Updates Their Own Profile
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    const employee = await Employee.findOneAndUpdate(
      { user: userId },
      { bio, skills },
      { new: true, upsert: true }
    );

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ success: true, user, employee, token });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

// ✅ 3. Admin Updates Any Employee’s Profile
export const updateAnyEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params; // ID của employee
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    const user = await User.findById(employee.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user của nhân viên" });
    }

    // Cập nhật user
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();

    // Cập nhật employee
    employee.department = req.body.department || employee.department;

    await employee.save();

    res
      .status(200)
      .json({ success: true, message: "Đã cập nhật thông tin nhân viên" });
  } catch (error) {
    console.error("Admin profile update error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};
// ✅ 4. Get employee list (admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email")
      .populate("department", "name")
      .populate("salary", "totalPay");
    res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Get employees error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ✅ 5. Admin Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm nhân viên
    const employee = await Employee.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    // Kiểm tra xem có bản lương nào không
    const salaryCount = await Salary.countDocuments({ employee: id });

    // Xoá bản lương nếu có
    if (salaryCount > 0) {
      await Salary.deleteMany({ employee: id });
    }

    // Xoá nhân viên và user liên kết
    await Employee.findByIdAndDelete(id);
    await User.findByIdAndDelete(employee.user);

    const message =
      salaryCount > 0
        ? "🗑️ Đã xóa nhân viên và các bản lương liên quan."
        : "🗑️ Đã xóa nhân viên (không có bản lương).";

    res.status(200).json({ message });
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
      return res
        .status(400)
        .json({ success: false, message: "Missing name query parameter." });
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
    const { id } = req.params; // id là Employee._id

    // Tìm Employee theo _id
    const employee = await Employee.findById(id)
      .populate({
        path: "user",
        select: "name email", // Chỉ lấy name và email từ User
      })
      .populate({
        path: "department",
        select: "name",
      })
      .populate({
        path: "salary",
        options: { sort: { createdAt: -1 } }, // sắp xếp theo thời gian mới nhất
      });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee profile not found" });
    }

    return res.status(200).json({
      success: true,
      employee, // Bao gồm cả user và salary
    });
  } catch (error) {
    console.error("❌ Error in getEmployeeById:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve employee" });
  }
};
