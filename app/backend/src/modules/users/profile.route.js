import { Router } from "express";
import profileController from "./profile.controller.js"; 
import { uploadResume } from "../../middlewares/upload.middleware.js";
import { completeProfileSchema, updateProfileSchema } from "../../validators/profile.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/complete", validate(completeProfileSchema), profileController.complete);

router.patch("/update", validate(updateProfileSchema), profileController.update);

router.post(
    "/resume",
    uploadResume,
    profileController.uploadResume
);

router.get("/resume", profileController.getResume);

export default router;
