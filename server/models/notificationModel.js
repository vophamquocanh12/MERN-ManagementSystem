import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["info", "warning", "alert"],
    default: "info",
  },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  targetRole: { type: String, enum: ["admin", "employee", "all"], default: "all" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
