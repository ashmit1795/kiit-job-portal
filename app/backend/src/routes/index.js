import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import profileGuard from "../middlewares/profileGuard.middleware.js";

import authRoute from "../modules/users/auth.route.js";
import profileRoute from "../modules/users/profile.route.js";
import healthRoute from "../modules/health/health.route.js";
import academicRoute from "../modules/academics/academic.route.js";
import jobRoute from "../modules/job/job.route.js";
import announcementRoute from "../modules/announcement/announcement.route.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import roleGuard from "../middlewares/roleGuard.middleware.js";

const router = Router();

// Public routes (if any in future)
router.use("/academics", academicRoute);

// Health check route (public)
router.use("/health", healthRoute);

// Auth route (needs authentication but no profile guard)
router.use("/auth", authenticate, authRoute);

// Profile route (needs authentication but not profile guard)
router.use("/profile", authenticate, profileRoute);

// Apply authentication + profile guard globally for protected routes
router.use(authenticate, profileGuard);

router.use("/jobs", jobRoute);
router.use("/announcements", announcementRoute);

router.use("/admin", roleGuard("admin", "volunteer"), adminRoutes);

export default router;
