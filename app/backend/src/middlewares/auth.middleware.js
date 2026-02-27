import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";

export default async function authenticate(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Authentication token missing", 401);
		}

		const token = authHeader.split(" ")[1];

		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			throw new AppError("Invalid or expired token", 401);
		}

		// Domain restriction
		if (!data.user.email.endsWith("@kiit.ac.in")) {
			throw new AppError("Unauthorized domain", 403);
		}

		req.user = data.user;

		next();
	} catch (err) {
		next(err);
	}
}
