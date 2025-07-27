// models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Leave", leaveSchema);
