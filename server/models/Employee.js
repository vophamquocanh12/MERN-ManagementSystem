// models/Employee.js
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  bio: String,
  skills: [String],
  salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
}, { timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);
