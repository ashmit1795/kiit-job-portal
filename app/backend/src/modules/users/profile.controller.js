import AppResponse from "../../utils/AppResponse.js";
import profileService from "./profile.service.js";

class ProfileController {
	async complete(req, res, next) {
		try {
			const userId = req.user.id;

			const updatedUser = await profileService.completeProfile(userId, req.body);

			return new AppResponse({
				message: "Profile completed successfully",
				data: updatedUser,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};
}

export default new ProfileController();
