import AppResponse from "../../utils/AppResponse.js";
import userService from "./user.service.js";

class AuthController {
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
