import { Router } from "express";
import { getDoctorDashboard } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getDoctorDashboard);

export default router;
