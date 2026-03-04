import multer from "multer";
import AppError from "../utils/AppError.js";

const storage = multer.memoryStorage();

/**
 * Middleware for handling file uploads, specifically for uploading resumes in PDF format. It uses Multer to manage file storage in memory and enforces a file size limit of 2MB. The middleware also includes a file filter to ensure that only PDF files are accepted. If a file is uploaded that exceeds the size limit or is not a PDF, an appropriate error is thrown.
 * @function uploadResume
 * @type {Function} - A Multer middleware function configured to handle single file uploads with specific validation rules for file type and size.
 * @throws {AppError} Throws an AppError with a 400 status code if the uploaded file is not a PDF or exceeds the size limit.
 */
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
