// server/controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import moment from "moment";

// ✅ 1. POST /api/attendance (admin marks any)
export const markByAdmin = async (req, res) => {
  try {
    const { employee, date, status, remarks } = req.body;
    const attendance = await Attendance.create({ employee, date, status, remarks });
    res.status(201).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 2. POST /api/attendance/mark (employee marks self)
export const markByEmployee = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const exists = await Attendance.findOne({
      employee: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (exists) {
      return res.status(400).json({ error: "Already marked for today" });
    }

    const record = await Attendance.create({
      employee: userId,
      status: "Present",
    });

    res.status(201).json({ success: true, attendance: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 3. GET /api/attendance (admin filter by employee/month)
export const getAllAttendance = async (req, res) => {
  try {
    const { employee, month } = req.query;
    const query = {};

    if (employee) query.employee = employee;

    if (month) {
      const start = moment(month, 'YYYY-MM').startOf('month').toDate();
      const end = moment(month, 'YYYY-MM').endOf('month').toDate();
      query.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(query)
      .populate("employee", "name email")
      .sort({ date: -1 });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 4. GET /api/attendance/my (employee only)
export const getOwnAttendance = async (req, res) => {
  try {
    const employee = req.user._id;
    const records = await Attendance.find({ employee }).sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 5. GET /api/attendance/trends
export const getAttendanceTrend = async (req, res) => {
  try {
    const result = await Attendance.aggregate([
      {
        $match: { status: "Present" },
      },
      {
        $group: {
          _id: { $month: "$date" },
          presentDays: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = result.map((r) => ({
      month: months[r._id - 1],
      presentDays: r.presentDays,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 6. GET /api/attendance/summary
export const getAttendanceSummary = async (req, res) => {
  try {
    const summary = await Attendance.aggregate([
      {
        $group: {
          _id: "$status", // Present / Absent / Leave
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 7. GET /api/attendance/stats (bar chart)
export const getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const formatted = stats.map((month) => ({
      month: new Date(2024, month._id - 1).toLocaleString("default", { month: "short" }),
      present: month.present,
      absent: month.absent,
    }));

    res.status(200).json({ success: true, stats: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
