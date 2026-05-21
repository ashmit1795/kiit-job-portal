import { Router } from "express";
import profileController from "./profile.controller.js";
import { uploadResume } from "../../middlewares/upload.middleware.js";
import { completeProfileSchema, updateProfileSchema, updateNotificationPrefsSchema } from "../../validators/profile.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// Route to complete the user's profile
router.post("/complete", validate(completeProfileSchema), profileController.complete);

// Route to update the user's profile information
router.patch("/update", validate(updateProfileSchema), profileController.update);

// Route to upload the user's resume
router.post("/resume", uploadResume, profileController.uploadResume);

// Route to get the signed URL for downloading the user's resume
router.get("/resume", profileController.getResume);

// Route to delete the user's resume
router.delete("/resume", profileController.deleteResume);

// Route to fetch profile stats
router.get("/stats", profileController.getStats);

// Route to fetch notification preferences
router.get("/notifications", profileController.getNotificationPrefs);

// Route to update notification preferences
router.patch("/notifications", validate(updateNotificationPrefsSchema), profileController.updateNotificationPrefs);


export default router;
