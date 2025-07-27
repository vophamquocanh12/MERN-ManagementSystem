// jobs/dailySummaryJob.js
import cron from "node-cron";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

cron.schedule("0 18 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const newUsers = await User.find({ createdAt: { $gte: new Date(today) } });
    const leaveRequests = await Leave.find({ date: today });
    const absentees = await Attendance.find({ date: today, status: "Absent" });

    const emailBody = `
🌅 Daily Summary:
👥 New Employees: ${newUsers.length}
📤 Leave Requests: ${leaveRequests.length}
🚫 Absentees: ${absentees.length}

🔁 Summary generated automatically at 6:00 PM.
    `;

    await sendEmail("admin@yourdomain.com", "📊 EMS Daily Summary", emailBody);
    console.log("✅ Daily summary email sent.");
  } catch (err) {
    console.error("❌ Failed to send daily summary:", err.message);
  }
});
