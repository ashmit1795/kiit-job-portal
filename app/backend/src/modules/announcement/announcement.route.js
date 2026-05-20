import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import roleGuard from "../../middlewares/roleGuard.middleware.js";
import { uploadCircular } from "../../middlewares/upload.middleware.js";
import { createAnnouncementSchema } from "../../validators/announcement.validator.js";
import announcementController from "./announcement.controller.js";

const router = Router();

/**
 * Create announcement
 * Admin + Volunteer
 */
router.post("/", roleGuard("admin", "volunteer"), uploadCircular, validate(createAnnouncementSchema), announcementController.createAnnouncement);

/**
 * List announcements
 */
router.get("/", announcementController.getAnnouncements);

/**
 * Announcement details
 */
router.get("/:id", announcementController.getAnnouncementById);

/**
 * Download announcement circular
 */
router.get("/:id/circular", announcementController.downloadCircular);

export default router;
