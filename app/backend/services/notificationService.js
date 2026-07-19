import { getRepository } from "../repositories/index.js";

function normalizeId(value) {
  return value === undefined || value === null ? value : String(value);
}

function byCreatedDesc(a, b) {
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
}

export async function createNotification({ recipient, title, message, type = "info", metadata = {} }) {
  const repo = getRepository("Notification");
  return repo.create({
    recipient: normalizeId(recipient),
    title,
    message,
    type,
    read: false,
    metadata,
  });
}

export async function listNotificationsForUser(userId, { unreadOnly = false } = {}) {
  const repo = getRepository("Notification");
  const all = await repo.find({});
  const mine = all.filter((n) => normalizeId(n.recipient) === normalizeId(userId));
  const scoped = unreadOnly ? mine.filter((n) => !n.read) : mine;
  return [...scoped].sort(byCreatedDesc);
}

export async function markRead(notificationId) {
  const repo = getRepository("Notification");
  return repo.findByIdAndUpdate(notificationId, { read: true });
}

export async function markAllRead(userId) {
  const repo = getRepository("Notification");
  const mine = await listNotificationsForUser(userId, { unreadOnly: true });
  await Promise.all(mine.map((n) => repo.findByIdAndUpdate(n._id || n.id, { read: true })));
  return listNotificationsForUser(userId);
}

// Legacy helper kept for back-compat with any direct mongoose-model callers.
export async function listNotifications(userId, { unreadOnly = false } = {}) {
  return listNotificationsForUser(userId, { unreadOnly });
}
