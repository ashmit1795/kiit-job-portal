import { Router } from "express";
import authController from "./auth.controller.js";

const router = Router();

// Route to get the authenticated user's profile information
router.get("/me", authController.me);

export default router;
