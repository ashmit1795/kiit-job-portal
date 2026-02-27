import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import authController from "./auth.controller.js";

const router = Router();

router.get("/me", authenticate, authController.me);

export default router;
