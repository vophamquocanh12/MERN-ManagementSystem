import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

export const getAdminStats = async (req, res) => {
  try {
    const employeesCount = await Employee.countDocuments();
    const departmentsCount = await Department.countDocuments();

    // Add dummy stats or real if you have them
    const approvedLeaves = 14;
    const monthlyPayroll = 85000;

    res.status(200).json({
      success: true,
      data: {
        employeesCount,
        departmentsCount,
        approvedLeaves,
        monthlyPayroll,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
