import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => res.json({ success: true, message: "Doctor route placeholder" }));

export default router;

