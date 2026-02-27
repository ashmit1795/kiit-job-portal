import AppError from "../utils/AppError.js";

export default function roleGuard(...allowedRoles) {
	return (req, res, next) => {
		if (!allowedRoles.includes(req.user.role)) {
			throw new AppError("Insufficient permissions", 403);
		}

		next();
	};
}
