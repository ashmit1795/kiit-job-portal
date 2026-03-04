/**
 * AppError class for standardized error handling in the application.
 * This class extends the built-in Error class and includes additional properties such as statusCode, isOperational, and details to provide more context about the error. It is used throughout the application to create consistent error objects that can be easily handled by error-handling middleware.
 * Example usage:
 * throw new AppError("Resource not found", 404);
 * throw new AppError("Validation failed", 400, true, { field: "email", message: "Email is required" });
 */
class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true, details = null) {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.details = details;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
