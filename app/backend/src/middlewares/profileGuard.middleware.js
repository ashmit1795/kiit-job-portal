import AppError from "../utils/AppError.js";

/**
 * Middleware to enforce profile completion for authenticated users. It allows access to authentication and profile completion routes without restrictions, but requires students and volunteers to have completed their profiles before accessing other routes. Admin users are exempt from this requirement. If a user has not completed their profile, an error is thrown prompting them to complete it first.
 * @function profileGuard
 * @param {Object} req - The Express request object, which contains information about the authenticated user and the original URL of the request.
 * @param {Object} res - The Express response object, used to send responses back to the client.
 * @param {Function} next - The next middleware function in the Express pipeline, called to pass control to the next middleware or route handler.
 * @throws {AppError} Throws an AppError with a 403 status code if a student or volunteer user has not completed their profile and attempts to access restricted routes.
 */
export default function profileGuard(req, res, next) {
	// Allow auth endpoints
	if (req.originalUrl.startsWith("/api/auth")) {
		return next();
	}

	// Allow profile completion endpoint
	if (req.originalUrl.startsWith("/api/profile/complete")) {
		return next();
	}

	// Admins bypass profile completion
	if (req.user.role === "admin") {
		return next();
	}

	// Students & volunteers must complete profile
	if (!req.user.profile_completed) {
		throw new AppError("Complete your profile first", 403);
	}

	next();
}
