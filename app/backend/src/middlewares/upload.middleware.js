import multer from "multer";
import AppError from "../utils/AppError.js";

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype !== "application/pdf") {
			return cb(new AppError("Only PDF files allowed", 400));
		}
		cb(null, true);
	},
});

export const uploadResume = upload.single("resume");
