import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => res.json({ success: true, message: "Parent route placeholder" }));

export default router;

