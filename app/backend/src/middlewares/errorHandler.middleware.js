import logger from "../utils/logger.js";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
	let statusCode = err.statusCode || 500;
	let isOperational = err instanceof AppError ? err.isOperational : false;
	let details = err.details || null;

	logger.error("Request failed", {
		method: req.method,
		url: req.originalUrl,
		statusCode,
		message: err.message,
		stack: err.stack,
	});

	let message = err.message || "An error occurred";

	if (!isOperational) {
		statusCode = 500;
		message = "An unexpected error occurred. Please try again later.";
	}

	const response = {
		success: false,
		message,
		details,
	};

	if (env.NODE_ENV !== "production") {
		response.stack = err.stack;
	}

	res.status(statusCode).json(response);
}
