import { Router } from "express";
import { getStudents, getStudentById } from "../controllers/studentController.js";
import { getDashboard } from "../controllers/dashboardController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, restrictTo("teacher", "admin"));
router.get("/dashboard", getDashboard);
router.get("/students", getStudents);
router.get("/students/:id", getStudentById);

export default router;
