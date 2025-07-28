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
    const { employee, month, basePay, bonus, deductions, remarks } =
      req.body;

    const totalPay = basePay + (bonus || 0) - (deductions || 0);

    const salary = await Salary.create({
      employee,
      month,
      basePay,
      bonus,
      deductions,
      totalPay,
      remarks,
    });createSalaryRecord;

    res.status(201).json({ success: true, salary });
  } catch (err) {
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
      .populate("employee", "name department")
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
    const employeeId = req.user._id;
    const salaries = await Salary.find({ employee: employeeId }).sort({ paidDate: -1 });

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
          _id: { $month: "$paidDate" },
          total: { $sum: "$totalPay" },
        },
      },
      { $sort: { "_id": 1 } },
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
      { $sort: { "_id": 1 } },
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
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = stats.map((s) => ({
      month: new Date(2000, s._id - 1).toLocaleString("default", { month: "short" }),
      total: s.total,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


