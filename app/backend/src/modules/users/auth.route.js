import { Router } from "express";
import authController from "./auth.controller.js";

const router = Router();

router.get("/me", authController.me);

export default router;
