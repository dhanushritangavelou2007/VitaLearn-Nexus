import { asyncHandler } from "../utils/asyncHandler.js";
import Report from "../models/Report.js";

export const createSymptomReport = asyncHandler(async (req, res) => {
  const report = await Report.create({ ...req.body, type: "Symptom Report" });
  res.status(201).json({ success: true, data: report });
});

