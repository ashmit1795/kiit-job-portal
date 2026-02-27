import AppError from "../utils/AppError.js";

export default function profileGuard(req, res, next) {
	if (!req.user.profile_completed) {
		throw new AppError("Complete your profile first", 403);
	}

	next();
}
