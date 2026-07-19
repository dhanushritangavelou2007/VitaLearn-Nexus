import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardSummary } from "../services/dashboardService.js";
import { getRepository } from "../repositories/index.js";

export const getParentDashboard = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary();
  
  // Parents only need their child's specific data, but we can return the standard format.
  // The frontend handles filtering the student array by parent email.
  res.json({ success: true, data: summary });
});
