import Appointment from "../models/Appointment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listAppointments } from "../services/appointmentService.js";

export const getAppointments = asyncHandler(async (req, res) => {
  const { items, pagination } = await listAppointments(req.query);
  res.json({ success: true, data: items, pagination });
});

export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ success: true, data: appointment });
});

