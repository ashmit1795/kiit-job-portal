import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import roleGuard from "../../middlewares/roleGuard.middleware.js";
import { createJobSchema, updateJobSchema } from "../../validators/job.validator.js";
import jobController from "./job.controller.js";
import { uploadCircular } from "../../middlewares/upload.middleware.js";

const router = Router();

/**
 * Create job
 * Admin + Volunteer
 */
router.post("/", roleGuard("admin", "volunteer"), uploadCircular, validate(createJobSchema), jobController.createJob);

/**
 * List jobs
 */
router.get("/", jobController.getJobs);

/** 
 * Job feed for students
 */
router.get("/feed", jobController.getJobFeed);

/**
 * Job details
 */
router.get("/:id", jobController.getJobById);

/**
 * Update job
 * Admin + Volunteer (checks owner inside service)
 */
router.patch("/:id", roleGuard("admin", "volunteer"), uploadCircular, validate(updateJobSchema), jobController.updateJob);

/**
 * Download circular
 */
router.get("/:id/circular", jobController.downloadCircular);

/**
 * Admin approval
 */
router.patch("/:id/approve", roleGuard("admin"), jobController.approveJob);

router.patch("/:id/reject", roleGuard("admin"), jobController.rejectJob);

export default router;

