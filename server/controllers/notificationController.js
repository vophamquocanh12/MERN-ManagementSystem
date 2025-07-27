import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const role = req.query.role || "all";
    const notifs = await Notification.find({
      $or: [{ targetRole: role }, { targetRole: "all" }],
    }).sort({ createdAt: -1 });

    res.json(notifs);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
