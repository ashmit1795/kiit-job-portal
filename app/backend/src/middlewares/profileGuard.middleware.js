import AppError from "../utils/AppError.js";

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
