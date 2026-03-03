import logger from "../utils/logger.js";
import env from "../config/env.js";

export default function errorHandler(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const isOperational = err.isOperational || true;

	logger.error("Request failed", {
		method: req.method,
		url: req.originalUrl,
		statusCode,
		message: err.message,
		stack: err.stack,
	});

	let message = "Internal Server Error";

	if (isOperational) {
		message = err.message;
	}

	const response = {
		success: false,
		message,
	};

	if (env.NODE_ENV !== "production") {
		response.stack = err.stack;
	}

	res.status(statusCode).json(response);
}
