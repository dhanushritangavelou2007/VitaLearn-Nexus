import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getAppointments);
router.post("/", restrictTo("teacher", "doctor", "admin"), createAppointment);

export default router;

