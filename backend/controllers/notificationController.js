import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const repo = getRepository("Notification");
  const items = await repo.find({}, { createdAt: -1 }, 0, 20);
  res.json({ success: true, data: items });
});
