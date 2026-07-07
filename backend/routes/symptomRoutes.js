import { Router } from "express";
import { createSymptomReport } from "../controllers/symptomsController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/", restrictTo("teacher", "doctor", "admin"), createSymptomReport);

export default router;

