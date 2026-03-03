import logger from "../utils/logger.js";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const isOperational = err instanceof AppError ? err.isOperational : false;
	const details = err.details || null;

	logger.error("Request failed", {
		method: req.method,
		url: req.originalUrl,
		statusCode,
		message: err.message,
		stack: err.stack,
	});

	let message;

	if (!isOperational) {
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
