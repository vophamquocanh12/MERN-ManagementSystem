import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

export const getAdminStats = async (req, res) => {
  try {
    const employeesCount = await Employee.countDocuments();
    const departmentsCount = await Department.countDocuments();
     const result = await Salary.aggregate([
       {
         $group: {
           _id: null,
           totalPaid: { $sum: "$totalPay" },
         },
       },
     ]);

     const totalSalay = result[0]?.totalPaid || 0;

    // Add dummy stats or real if you have them
    const approvedLeaves = 14;
    // const monthlyPayroll = 85000;
    res.status(200).json({
      success: true,
      data: {
        employeesCount,
        departmentsCount,
        approvedLeaves,
        totalSalay,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
