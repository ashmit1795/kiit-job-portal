import AppResponse from "../../utils/AppResponse.js";
import userService from "./user.service.js";

/**
 * Controller for handling authentication-related routes.
 */
class AuthController {

	/**
	 * Handles the /auth/me route to return the authenticated user's details.
	 * It uses the userService to sync the user data and returns a standardized response.
	 * If any error occurs during the process, it passes the error to the next middleware.
	 */
	async me(req, res, next) {
		try {
			const user = await userService.syncUser(req.user);

			return new AppResponse({
				message: "User authenticated successfully",
				data: user,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};
}

export default new AuthController();
