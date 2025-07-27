// controllers/analyticsController.js
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

/**
 * 📊 Monthly Leave Count (for bar chart)
 * Route: GET /api/analytics/leaves-per-month
 */
export const getLeavesPerMonth = async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
      {
        $group: {
          _id: { $month: "$startDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      count: leaves.find((l) => l._id === i + 1)?.count || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📋 Dashboard Summary Stats
 * Route: GET /api/analytics/dashboard-stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [departments, employees, leaves, salaries] = await Promise.all([
      Department.countDocuments(),
      Employee.countDocuments(),
      Leave.countDocuments(),
      Salary.countDocuments(),
    ]);

    const [leaveApproved, leavePending, leaveRejected] = await Promise.all([
      Leave.countDocuments({ status: "Approved" }),
      Leave.countDocuments({ status: "Pending" }),
      Leave.countDocuments({ status: "Rejected" }),
    ]);

    res.json({
      departments,
      employees,
      leaves,
      salaries,
      leaveApproved,
      leavePending,
      leaveRejected,
    });
  } catch (err) {
    console.error("Error getting dashboard stats", err);
    res.status(500).json({ error: "Server Error" });
  }
};
