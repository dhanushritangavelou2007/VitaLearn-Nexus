import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listNotificationsForUser, markRead, markAllRead } from "../services/notificationService.js";

// GET /notifications — scoped to the logged-in user only. Previously this
// returned the first 20 notifications system-wide regardless of recipient,
// which leaked every role's notifications to every other role.
export const getNotifications = asyncHandler(async (req, res) => {
  const items = await listNotificationsForUser(req.user.id || req.user._id, {
    unreadOnly: req.query.unreadOnly === "true",
  });
  res.json({ success: true, data: items });
});

export const markNotificationRead = asyncHandler(async (req, res, next) => {
  const updated = await markRead(req.params.id);
  if (!updated) return next(new AppError("Notification not found", 404));
  res.json({ success: true, data: updated });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const items = await markAllRead(req.user.id || req.user._id);
  res.json({ success: true, data: items });
});
