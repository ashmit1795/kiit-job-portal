class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true, details = null) {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
