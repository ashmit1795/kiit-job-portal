import AppResponse from "../../utils/AppResponse.js";
import userService from "./user.service.js";

class AuthController {
	async me(req, res, next) {
		try {
			const user = await userService.syncUser(req.user);

			const responseUser = {
				id: user.id,
				email: user.email,
				roll_number: user.roll_number,
				role: user.role,
                profile_completed: user.profile_completed
			};

			return new AppResponse({
				message: "User authenticated successfully",
				data: responseUser,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};
}

export default new AuthController();
