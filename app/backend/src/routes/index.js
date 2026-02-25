import { Router } from "express";
import healthRoute from "../modules/health/health.route.js";

const router = Router();

router.use("/health", healthRoute);

export default router;
