import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSymptomReport = asyncHandler(async (req, res) => {
  const repo = getRepository("Report");
  const report = await repo.create({ ...req.body, type: "Symptom Report" });
  res.status(201).json({ success: true, data: report });
});
