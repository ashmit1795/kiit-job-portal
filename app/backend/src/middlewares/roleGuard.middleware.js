import AppError from "../utils/AppError.js";

/**
 * Middleware to enforce role-based access control for authenticated users. It checks if the user's role is included in the list of allowed roles for a given route. If the user's role is not permitted, it throws an error with a 403 status code indicating insufficient permissions. This middleware can be used to protect routes that should only be accessible to certain user roles, such as admin-only routes or routes restricted to students or volunteers.
 * @function roleGuard
 * @param {...string} allowedRoles - A list of roles that are allowed to access the route. This can include roles such as "admin", "student", or "volunteer".
 * @return {Function} A middleware function that checks the user's role against the allowed roles and either allows access or throws an error.
 * @throws {AppError} Throws an AppError with a 403 status code if the user's role is not included in the allowed roles.
 */
export default function roleGuard(...allowedRoles) {
	return (req, res, next) => {
		if (!allowedRoles.includes(req.user.role)) {
			throw new AppError("Insufficient permissions", 403);
		}

		next();
	};
}
