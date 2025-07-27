// controllers/leaveController.js
import { io } from "../server.js";
import Leave from "../models/Leave.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary";
import fs from "fs";
import User from "../models/User.js";
import ExcelJS from "exceljs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ 1. Employee requests leave (with document upload)
export const requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const employeeId = req.user._id;

    let documentUrl = null;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "leave-documents",
      });
      documentUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const leave = await Leave.create({
      employee: employeeId,
      startDate,
      endDate,
      reason,
      document: documentUrl,
      status: "Pending",
    });

    res.status(201).json({ success: true, leave });
  } catch (err) {
    console.error("Leave request error:", err);
    res.status(500).json({ success: false, error: "Leave request failed" });
  }
};

// ✅ 2. Admin approves/rejects leave
export const approveLeave = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    ).populate("employee");

    io.emit("notification", {
      message: `Leave request for ${leave.employee.name} was ${status}`,
      leaveId: leave._id,
      employeeId: leave.employee._id,
      type: "leave-status",
    });

    await sendEmail({
      to: leave.employee.email,
      subject: "Leave Request " + status,
      title: `Your Leave Was ${status}`,
      message: `Hi ${leave.employee.name}, your leave from <strong>${leave.startDate}</strong> to <strong>${leave.endDate}</strong> has been <strong>${status.toLowerCase()}</strong>.`,
      buttonText: "View Dashboard",
      buttonLink: "https://your-ems-app.com/employee-dashboard",
    });

    const admins = await User.find({ role: "admin" });
    const dateRange = `${new Date(leave.startDate).toDateString()} to ${new Date(leave.endDate).toDateString()}`;

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: "Leave Approved",
        title: "Leave Request Approved",
        message: `Leave request for <b>${leave.employee.name}</b> from <b>${dateRange}</b> has been <b>${status.toLowerCase()}</b>.`,
      });
    }

    res.status(200).json({ success: true, message: "Leave status updated", leave });
  } catch (error) {
    console.error("Error approving leave:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅ 3. Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee", "name email").sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 4. Get single leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id).populate("employee", "name email");

    if (!leave) return res.status(404).json({ success: false, error: "Leave not found" });
    if (req.user.role !== "admin" && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized access" });
    }

    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 5. Get leaves by employee ID
export const getLeavesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaves = await Leave.find({ employee: employeeId }).sort({ startDate: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 6. Get approved leaves for calendar
export const getApprovedLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Approved" })
      .populate("employee", "name role department")
      .sort({ startDate: 1 });

    const calendarEvents = leaves.map((leave) => ({
      title: `${leave.employee.name} (${leave.employee.role})`,
      start: leave.startDate,
      end: leave.endDate,
      id: leave._id,
      extendedProps: {
        reason: leave.reason,
        department: leave.employee.department,
        status: leave.status,
      },
      backgroundColor: leave.employee.role === "admin" ? "#facc15" : "#38bdf8",
    }));

    res.status(200).json(calendarEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 7. Update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 8. Paginated + search leaves
export const getLeaves = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const query = { reason: { $regex: search, $options: "i" } };
  const total = await Leave.countDocuments(query);
  const leaves = await Leave.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("employee", "name department");

  res.status(200).json({
    leaves,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
};

// ✅ 9. Monthly leave trends
export const getLeaveTrends = async (req, res) => {
  try {
    const data = await Leave.aggregate([
      { $match: { status: "Approved", startDate: { $ne: null } } },
      {
        $group: {
          _id: { $month: "$startDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      count: data.find((d) => d._id === i + 1)?.count || 0,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("getLeaveTrends error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 10. Export to Excel
export const exportLeavesToExcel = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.reason = { $regex: search, $options: "i" };

    const leaves = await Leave.find(query).populate("employee", "name email");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leaves");

    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Start Date", key: "start", width: 20 },
      { header: "End Date", key: "end", width: 20 },
      { header: "Status", key: "status", width: 15 },
    ];

    leaves.forEach((leave) => {
      sheet.addRow({
        name: leave.employee.name,
        email: leave.employee.email,
        start: leave.startDate?.toISOString().split("T")[0],
        end: leave.endDate?.toISOString().split("T")[0],
        status: leave.status,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=leaves.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ success: false, error: "Failed to export leaves" });
  }
};

// ✅ 11. Bar chart leave stats
export const getLeaveStats = async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = { Approved: 0, Pending: 0, Rejected: 0 };
    leaves.forEach((l) => (formatted[l._id] = l.count));

    res.status(200).json({ success: true, stats: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 12. Employee summary for their own leaves
export const getMyLeaveSummary = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ startDate: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (err) {
    console.error("getMyLeaveSummary error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch leave summary" });
  }
};
