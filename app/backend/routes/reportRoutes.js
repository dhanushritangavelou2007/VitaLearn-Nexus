import { Router } from "express";
import { browseReports, createReport, getReportById, getReports, respondToReport } from "../controllers/reportController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getReports);
router.get("/browse", restrictTo("doctor", "admin"), browseReports);
router.get("/:id", getReportById);
router.post("/", restrictTo("teacher", "doctor", "parent", "student", "admin"), createReport);
router.post("/:id/observation", restrictTo("doctor"), respondToReport);

export default router;
