import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import userRepository from "../modules/users/user.repository.js";
import logger from "../utils/logger.js";

export default async function authenticate(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Authentication token missing", 401);
		}

		const token = authHeader.split(" ")[1];

        const { data, error } = await supabase.auth.getUser(token);
        logger.debug("Supabase auth response", { data, error });

		if (error || !data.user) {
			throw new AppError("Invalid or expired token", 401);
		}

		const email = data.user.email;

		if (!/^\d+@kiit\.ac\.in$/.test(email)) {
			throw new AppError("Unauthorized KIIT email format", 403);
		}

		// Attach supabase user temporarily
		const supabaseUser = data.user;

		// Sync / fetch application user
		let appUser = await userRepository.findById(supabaseUser.id);

		if (!appUser) {
			const rollNumber = email.split("@")[0];

			appUser = await userRepository.create({
				id: supabaseUser.id,
				email,
				roll_number: rollNumber,
				profile_completed: false,
			});
		}

		// Attach app user instead
		req.user = appUser;

		next();
	} catch (err) {
		next(err);
	}
}
