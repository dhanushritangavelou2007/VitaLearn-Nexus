import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listReports } from "../services/reportService.js";

export const getReports = asyncHandler(async (req, res) => {
  const { items, pagination } = await listReports(req.query);
  res.json({ success: true, data: items, pagination });
});

export const createReport = asyncHandler(async (req, res) => {
  const repo = getRepository("Report");
  const report = await repo.create(req.body);
  res.status(201).json({ success: true, data: report });
});

export const getReportById = asyncHandler(async (req, res, next) => {
  const repo = getRepository("Report");
  const report = await repo.findById(req.params.id);
  if (!report) return next(new AppError("Report not found", 404));
  res.json({ success: true, data: report });
});
