import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import userService from "../modules/users/user.service.js";

/**
 * Middleware to authenticate incoming requests using Supabase authentication. It supports a development authentication mode for non-production environments, allowing developers to simulate authentication by providing an email in the request headers. In production, it validates the Bearer token from the Authorization header, retrieves the user information from Supabase, and ensures that the email belongs to the KIIT domain. If the user does not exist in the application database, it creates a new user record. The authenticated user's information is then attached to the request object for use in subsequent middleware or route handlers.
 * If any step of the authentication process fails, an appropriate error is thrown and passed to the next middleware for handling.
 * @function authenticate
 * @param {Object} req - The Express request object, which may contain authentication information in the headers.
 * @param {Object} res - The Express response object, used to send responses back to the client.
 * @param {Function} next - The next middleware function in the Express pipeline, called to pass control to the next middleware or route handler.
 * @throws {AppError} Throws an AppError if authentication fails due to missing or invalid tokens, unauthorized email formats, or any issues with user retrieval or creation in the database.
 */
export default async function authenticate(req, res, next) {
	try {
		/* ---------------- DEV AUTH MODE ---------------- */

		if (env.NODE_ENV !== "production" && env.DEV_AUTH_ENABLED === "true") {
			const devEmail = req.headers["x-dev-email"];

			if (!devEmail) {
				throw new AppError("x-dev-email header required in dev mode", 401);
			}

			logger.warn(`⚠️ DEV AUTH: Logging in as ${devEmail}`);

			const user = await userService.syncUser({
				id: `dev-${devEmail}`,
				email: devEmail,
			});

			req.user = user;

			return next();
		}

		/* ---------------- NORMAL AUTH ---------------- */

		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Authentication token missing", 401);
		}

		const token = authHeader.split(" ")[1];

		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			throw new AppError("Invalid or expired token", 401);
		}

		const appUser = await userService.syncUser(data.user);

		req.user = appUser;

		next();
	} catch (err) {
		next(err);
	}
}
