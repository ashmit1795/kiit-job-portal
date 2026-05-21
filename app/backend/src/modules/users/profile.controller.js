import AppResponse from "../../utils/AppResponse.js";
import profileService from "./profile.service.js";
import AppError from "../../utils/AppError.js";

/**
 * Controller for handling user profile-related routes, such as completing the profile, updating profile information, and managing resume uploads.
 * Each method corresponds to a specific route and uses the profileService to perform the necessary operations.
 * The controller also ensures that appropriate responses are sent back to the client and that errors are handled gracefully.
 */
class ProfileController {
	/**
	 * Handles the `POST /profile/complete` route to complete the user's profile.
	 * It validates the incoming request body against the completeProfileSchema and then calls the profileService to complete the profile.
	 * If successful, it returns a standardized response with the updated user data. If any error occurs, it passes the error to the next middleware.
	 */
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

	/**
	 * Handles the `PATCH /profile/update` route to update the user's profile information.
	 * It validates the incoming request body against the updateProfileSchema and then calls the profileService to update the profile.
	 * If successful, it returns a standardized response with the updated user data. If any error occurs, it passes the error to the next middleware.
	 */
	async update(req, res, next) {
		try {
			const userId = req.user.id;

			const updatedUser = await profileService.updateProfile(userId, req.body);

			return new AppResponse({
				message: "Profile updated successfully",
				data: updatedUser,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * Handles the `POST /profile/resume` route to upload the user's resume.
	 * It checks if a file is included in the request and then calls the profileService to handle the resume upload.
	 * If successful, it returns a standardized response with the updated user data. If any error occurs, it passes the error to the next middleware.
	 */
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

	/**
	 * Handles the `GET /profile/resume` route to generate a signed URL for downloading the user's resume.
	 * It calls the profileService to get the signed URL and returns it in a standardized response. If any error occurs, it passes the error to the next middleware.
	 */
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

	/**
	 * Handles the `DELETE /profile/resume` route to remove the user's resume.
	 * It calls the profileService to delete the resume file and clear the resume URL.
	 */
	async deleteResume(req, res, next) {
		try {
			const updatedUser = await profileService.deleteResume(req.user.id);

			return new AppResponse({
				message: "Resume deleted successfully",
				data: updatedUser,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * Handles the `GET /profile/stats` route to fetch profile stats.
	 */
	async getStats(req, res, next) {
		try {
			const stats = await profileService.getProfileStats(req.user);

			return new AppResponse({
				message: "Profile stats fetched successfully",
				data: stats,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

}

export default new ProfileController();
