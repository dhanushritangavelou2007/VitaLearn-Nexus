import { getRepository } from "../repositories/index.js";

export async function listAppointments({ page = 1, limit = 20 }) {
  const repo = getRepository("Appointment");
  const skip = (Number(page) - 1) * Number(limit);
  const items = await repo.find({}, { createdAt: -1 }, skip, Number(limit));
  const total = await repo.countDocuments({});

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

