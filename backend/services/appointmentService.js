import Appointment from "../models/Appointment.js";

export async function listAppointments({ page = 1, limit = 20 }) {
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Appointment.find().populate("student doctor parent", "name rollNo role").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Appointment.countDocuments(),
  ]);

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

