import logger from "../utils/logger.js";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

/**
 * Global error handling middleware for the application. It captures all errors thrown in the application, logs them with relevant request information, and sends a standardized JSON response to the client. The middleware distinguishes between operational errors (instances of AppError) and programming or unknown errors, ensuring that sensitive error details are not exposed in production environments. In development, it includes the error stack trace in the response for easier debugging.
 * @function errorHandler
 * @param {Error} err - The error object thrown in the application.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */
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
