import { Router } from "express";
import healthRoute from "../modules/health/health.route.js";
import profileRoute from "../modules/users/profile.route.js";
import authRoute from "../modules/users/auth.route.js";

const router = Router();

router.use("/health", healthRoute);
router.use("/profile", profileRoute);
router.use("/auth", authRoute);

export default router;
