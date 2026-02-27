import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import profileController from "./profile.controller.js";

const router = Router();

router.post("/complete", authenticate, profileController.complete);

export default router;
