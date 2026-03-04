import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import roleGuard from "../../middlewares/roleGuard.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import academicController from "./academic.controller.js";
import { createProgramSchema, createBranchSchema, createBatchSchema } from "../../validators/academic.validator.js";

const router = Router();

/* ======================
READ ROUTES
====================== */

router.get("/programs", authenticate, academicController.getPrograms);
router.get("/branches", authenticate, academicController.getBranches);
router.get("/batches", authenticate, academicController.getBatches);

/* ======================
ADMIN ROUTES
====================== */

router.post("/programs", authenticate, roleGuard("admin"), validate(createProgramSchema), academicController.createProgram);
router.post("/branches", authenticate, roleGuard("admin"), validate(createBranchSchema), academicController.createBranch);
router.post("/batches", authenticate, roleGuard("admin"), validate(createBatchSchema), academicController.createBatch);

export default router;
