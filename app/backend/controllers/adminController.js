import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardSummary } from "../services/dashboardService.js";

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const summary = await getDashboardSummary();
  res.json({ success: true, data: summary });
});
