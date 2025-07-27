// models/Employee.js
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  designation: String,
  photoUrl: String,
  bio: String,
  skills: [String],
  attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
  salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
}, { timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);
