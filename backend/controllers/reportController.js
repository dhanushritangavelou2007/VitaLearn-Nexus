import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listReports, listReportsForUser, createReport as createReportService, addObservation } from "../services/reportService.js";

// GET /reports — role-scoped list for the observation pipeline (doctor/admin
// see everything, everyone else sees only what they personally submitted).
export const getReports = asyncHandler(async (req, res) => {
  const items = await listReportsForUser(req.user);
  res.json({ success: true, data: items });
});

// GET /reports/browse — paginated/filterable admin-style listing, kept
// separate from the role-scoped feed above.
export const browseReports = asyncHandler(async (req, res) => {
  const { items, pagination } = await listReports(req.query);
  res.json({ success: true, data: items, pagination });
});

export const createReport = asyncHandler(async (req, res) => {
  const report = await createReportService(req.body, req.user);
  res.status(201).json({ success: true, data: report });
});

export const getReportById = asyncHandler(async (req, res, next) => {
  const repo = getRepository("Report");
  const report = await repo.findById(req.params.id);
  if (!report) return next(new AppError("Report not found", 404));
  res.json({ success: true, data: report });
});

// POST /reports/:id/observation — doctor-only. Sets status=reviewed and
// notifies the original sender AND parent/student where applicable.
export const respondToReport = asyncHandler(async (req, res, next) => {
  const { observation, diagnosis, doctorReview, recommendation, prescription } = req.body;
  if (!observation || !observation.trim()) {
    return next(new AppError("Observation text is required.", 400));
  }
  const reviewData = {
    observation: observation.trim(),
    diagnosis: diagnosis?.trim() || null,
    doctorReview: doctorReview?.trim() || null,
    recommendation: recommendation?.trim() || null,
    prescription: prescription?.trim() || null,
  };
  const updated = await addObservation(req.params.id, req.user, reviewData);
  res.json({ success: true, data: updated });
});
