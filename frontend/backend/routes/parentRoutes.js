import { Router } from "express";
import { getParentDashboard } from "../controllers/parentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getParentDashboard);

export default router;
