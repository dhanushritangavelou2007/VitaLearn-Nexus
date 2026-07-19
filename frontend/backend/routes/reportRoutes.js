import { Router } from "express";
import { createReport, getReportById, getReports } from "../controllers/reportController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", restrictTo("teacher", "doctor", "admin"), createReport);

export default router;

