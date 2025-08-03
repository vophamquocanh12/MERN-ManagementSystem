import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

const getDepartmentsWithCount = async (req, res) => {
  try {
    const data = await User.aggregate([
      { $match: { department: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = await Promise.all(data.map(async item => {
      const dep = await Department.findById(item._id).lean();
      return {
        department: dep?.name || "Unknown",
        count: item.count
      };
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("Department chart error:", err);
    res.status(500).json({ success: false, error: "Failed to load departments" });
  }
};

// ✅ Add new department
const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, error: "Phòng ban đã tồn tại" });
    }

    const newDep = await Department.create({ name, description });
    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "add department server error" });
  }
};

// ✅ Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get departments server error" });
  }
};

// ✅ Get single department
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department server error" });
  }
};

// ✅ Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    return res.status(200).json({ success: true, department: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: "update department server error" });
  }
};

// ✅ Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedep = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, deletedep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "delete department server error" });
  }
};

export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsWithCount
};