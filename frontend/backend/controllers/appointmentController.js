import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listAppointments } from "../services/appointmentService.js";

export const getAppointments = asyncHandler(async (req, res) => {
  const { items, pagination } = await listAppointments(req.query);
  res.json({ success: true, data: items, pagination });
});

export const createAppointment = asyncHandler(async (req, res) => {
  const repo = getRepository("Appointment");
  const appointment = await repo.create(req.body);
  res.status(201).json({ success: true, data: appointment });
});
