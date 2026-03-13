import { Router } from "express";
import roleGuard from "../../middlewares/roleGuard.middleware.js";
import adminController from "./admin.controller.js";

const router = Router();

/**
 * Dashboard
 */
router.get("/dashboard", roleGuard("admin"), adminController.dashboard);

/**
 * Users
 */
router.get("/users", roleGuard("admin"), adminController.listUsers);

router.get("/users/:id", roleGuard("admin"), adminController.getUser);

router.patch("/users/:id/role", roleGuard("admin"), adminController.updateUserRole);

router.delete("/users/:id", roleGuard("admin"), adminController.deleteUser);

/**
 * Analytics
 */
router.get("/jobs/stats", roleGuard("admin"), adminController.jobStats);

export default router;
