// controllers/salaryController.js
import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";

/**
 * POST /api/salaries
 * Admin creates a new salary record
 */
export const createSalaryRecord = async (req, res) => {
  try {
    const { employee, month, basePay, bonuses, deductions, remarks } = req.body;

    if (!employee || !month || basePay === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc." });
    }

    const base = Number(basePay);
    const bon = Number(bonuses || 0);
    const ded = Number(deductions || 0);
    const totalPay = base + bon - ded;

    // ✅ Chuẩn hóa tháng theo định dạng YYYY-MM
    const formattedMonth = month.slice(0, 7); // Tránh có ngày lẻ như 2025-08-01

    // ✅ Kiểm tra xem đã có bản ghi cho nhân viên này trong tháng đó chưa
    const existingSalary = await Salary.findOne({
      employee,
      month: { $regex: `^${formattedMonth}$`, $options: "i" },
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: `Lương tháng ${formattedMonth} của nhân viên đã tồn tại.`,
      });
    }

    const salary = await Salary.create({
      employee,
      month: formattedMonth,
      basePay: base,
      bonuses: bon,
      deductions: ded,
      totalPay,
      remarks,
    });

    await Employee.findByIdAndUpdate(employee, {
      $push: { salary: salary._id },
    });

    res.status(201).json({ success: true, salary });
  } catch (err) {
    console.error("Error creating salary:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/*
  DELETE /api/salaries/:id
  Admin deletes a salary record
*/
export const deleteSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findById(id);
    if (!salary) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi lương." });
    }

    // Xóa ID lương khỏi nhân viên liên quan
    await Employee.findByIdAndUpdate(salary.employee, {
      $pull: { salary: salary._id },
    });

    // Xóa bản ghi lương
    await Salary.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "🗑️ Đã xóa bản ghi lương thành công.",
    });
  } catch (err) {
    console.error("Error deleting salary:", err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa bản ghi lương.",
    });
  }
};


/*
  PUT /api/salaries/:id
  Admin updates an existing salary record
*/
export const updateSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee, month, basePay, bonuses, deductions, remarks } = req.body;

    if (!employee || !month || basePay === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc." });
    }

    const base = Number(basePay);
    const bon = Number(bonuses || 0);
    const ded = Number(deductions || 0);
    const totalPay = base + bon - ded;

    const salary = await Salary.findById(id);
    if (!salary) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi lương." });
    }

    // Cập nhật các trường
    salary.month = month;
    salary.basePay = base;
    salary.bonuses = bon;
    salary.deductions = ded;
    salary.totalPay = totalPay;
    salary.remarks = remarks;

    await salary.save();

    res
      .status(200)
      .json({ success: true, message: "Cập nhật lương thành công", salary });
  } catch (err) {
    console.error("Error updating salary:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/salaries
 * Admin views all salary records
 */
export const getAllSalaries = async (req, res) => {
  try {
const salaries = await Salary.find()
  .populate({
    path: "employee",
    select: "department user", // chỉ cần select các trường cần dùng
    populate: [
      {
        path: "user",
        select: "name", // lấy tên user
      },
      {
        path: "department",
        select: "name", // lấy tên phòng ban
      },
    ],
  })
  .sort({ paidDate: -1 });

    res.status(200).json({ success: true, salaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/salaries/my
 * Employee views own salary records
 */
export const getSalaryByEmployee = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm Employee tương ứng với user đó
    const employee = await Employee.findOne({ user: userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    // Tìm tất cả bản ghi lương của employee này
    const salaries = await Salary.find({ employee: employee._id }).sort({
      month: -1,
    });
    res.status(200).json({ success: true, salaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/salaries/summary
 * Monthly payroll chart data
 */
export const getMonthlyPayrollSummary = async (req, res) => {
  try {
    const summary = await Salary.aggregate([
      {
        $group: {
          _id: "$month",
          total: { $sum: "$totalPay" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      total: summary.find((r) => r._id === i + 1)?.total || 0,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/salaries/summary-by-department
 * Payroll totals per department
 */
export const getPayrollByDepartment = async (req, res) => {
  try {
    const summary = await Salary.aggregate([
      {
        $lookup: {
          from: "users", // Replace "users" with "employees" if using Employee model
          localField: "employee",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$userInfo.department",
          total: { $sum: "$totalPay" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/salaries/salary-stats
 * For Recharts: Monthly salary stats for chart
 */
export const getMonthlySalaryStats = async (req, res) => {
  try {
    const stats = await Salary.aggregate([
      {
        $group: {
          _id: { $month: "$paidDate" },
          totalSalary: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      salary: stats.find((s) => s._id === i + 1)?.totalSalary || 0,
    }));

    res.status(200).json({ success: true, stats: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSalaryStats = async (req, res) => {
  try {
    const stats = await Salary.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = stats.map((s) => ({
      month: new Date(2000, s._id - 1).toLocaleString("default", {
        month: "short",
      }),
      total: s.total,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
