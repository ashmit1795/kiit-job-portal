import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import userRepository from "../modules/users/user.repository.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import crypto from "crypto";

export default async function authenticate(req, res, next) {
	try {
		// 🔹 DEV AUTH MODE
		if (env.NODE_ENV !== "production" && process.env.DEV_AUTH_ENABLED === "true") {
			const devEmail = req.headers["x-dev-email"];

			if (!devEmail) {
				throw new AppError("x-dev-email header required in dev mode", 401);
			}

			if (!/^\d+@kiit\.ac\.in$/.test(devEmail)) {
				throw new AppError("Invalid KIIT email format", 403);
			}
			logger.warn(`⚠️ DEV AUTH: Logging in as ${devEmail}`);

			let user = await userRepository.findByEmail(devEmail);

			const rollNumber = devEmail.split("@")[0];

			if (!user) {
				user = await userRepository.create({
					id: crypto.randomUUID(), // temporary UUID
					email: devEmail,
					roll_number: rollNumber,
					profile_completed: false,
				});
			}

			req.user = user;
			return next();
		}

		// 🔹 NORMAL AUTH FLOW (Production)
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Authentication token missing", 401);
		}

		const token = authHeader.split(" ")[1];

		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			throw new AppError("Invalid or expired token", 401);
		}

		const email = data.user.email;

		if (!/^\d+@kiit\.ac\.in$/.test(email)) {
			throw new AppError("Unauthorized KIIT email format", 403);
		}

		let appUser = await userRepository.findById(data.user.id);

		if (!appUser) {
			const rollNumber = email.split("@")[0];

			appUser = await userRepository.create({
				id: data.user.id,
				email,
				roll_number: rollNumber,
				profile_completed: false,
			});
		}

		req.user = appUser;

		next();
	} catch (err) {
		next(err);
	}
}
