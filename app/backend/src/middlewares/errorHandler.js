import logger from "../utils/logger.js";
import env from "../config/env.js";

export default function errorHandler(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const isOperational = err.isOperational || false;

	// Log full error details
	logger.error("Request failed", {
		method: req.method,
		url: req.originalUrl,
		statusCode,
		message: err.message,
		stack: err.stack,
	});

	// Response payload
	const response = {
		success: false,
		message: statusCode === 500 && !isOperational ? "Internal Server Error" : err.message,
	};

	// Include stack trace only in development
	if (env.NODE_ENV !== "production") {
		response.stack = err.stack;
	}

	res.status(statusCode).json(response);
}
