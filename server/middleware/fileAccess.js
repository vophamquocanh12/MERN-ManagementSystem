import File from "../models/File.js";

export const canViewFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id).populate("uploadedBy", "_id name role");
    if (!file) return res.status(404).json({ error: "File not found" });

    if (["admin", "hr"].includes(req.user.role) || file.uploadedBy._id.toString() === req.user._id.toString()) {
      req.fileRecord = file;
      return next();
    }
    res.status(403).json({ error: "Unauthorized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
