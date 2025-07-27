// server/models/Department.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Use default export for ES Modules
const Department = mongoose.model("Department", departmentSchema);
export default Department;
