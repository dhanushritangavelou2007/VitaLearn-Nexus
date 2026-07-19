import Notification from "../models/Notification.js";

export async function listNotifications(userId, { unreadOnly = false }) {
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;
  return Notification.find(query).sort({ createdAt: -1 });
}

