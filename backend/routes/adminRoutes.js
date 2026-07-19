import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getAdminDashboard);

export default router;
