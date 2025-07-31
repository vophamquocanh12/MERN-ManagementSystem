import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  basePay: {
    type: Number,
    required: true,
    min: 0,
  },
  bonuses: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  totalPay: {
    type: Number,
    required: true,
    min: 0,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
