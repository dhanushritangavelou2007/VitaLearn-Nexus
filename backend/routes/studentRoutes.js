import { Router } from "express";
import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from "../controllers/studentController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", restrictTo("teacher", "admin"), createStudent);
router.patch("/:id", restrictTo("teacher", "doctor", "admin"), updateStudent);
router.delete("/:id", restrictTo("admin"), deleteStudent);

export default router;

