import AppResponse from "../../utils/AppResponse.js";
import profileService from "./profile.service.js";
import AppError from "../../utils/AppError.js";

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
	}

	async update(req, res, next) {
		try {
			const userId = req.user.id;

			const updatedUser =
				await profileService.updateProfile(userId, req.body);

			return new AppResponse({
				message: "Profile updated successfully",
				data: updatedUser,
			}).send(res);

		} catch (err) {
			next(err);
		}
	}

	async uploadResume(req, res, next) {
		try {
			if (!req.file) {
				throw new AppError("Resume file is required", 400);
			}

			const userId = req.user.id;

			const updatedUser = await profileService.uploadResume(userId, req.file);

			return new AppResponse({
				message: "Resume uploaded successfully",
				data: updatedUser,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getResume(req, res, next) {
		try {
			const signedUrl = await profileService.getResumeDownloadUrl(req.user.id);

			return new AppResponse({
				message: "Resume URL generated",
				data: { url: signedUrl },
			}).send(res);
		} catch (err) {
			next(err);
		}
	}
}

export default new ProfileController();
