import { Router } from "express";
import healthController from "./health.controller.js";


const router = Router();

// Routes
router.get("/", healthController.check);

export default router;
