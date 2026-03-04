import { Router } from "express";
import profileController from "./profile.controller.js"; 
import { uploadResume } from "../../middlewares/upload.middleware.js";
import { completeProfileSchema, updateProfileSchema } from "../../validators/profile.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// Route to complete the user's profile 
router.post("/complete", validate(completeProfileSchema), profileController.complete);

// Route to update the user's profile information
router.patch("/update", validate(updateProfileSchema), profileController.update);

// Route to upload the user's resume
router.post(
    "/resume",
    uploadResume,
    profileController.uploadResume
);

// Route to get the signed URL for downloading the user's resume
router.get("/resume", profileController.getResume);

export default router;
