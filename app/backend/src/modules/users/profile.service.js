import supabase from "../../config/supabase.js";
import AppError from "../../utils/AppError.js";
import userRepository from "./user.repository.js";
import academicRepository from "../academics/academic.repository.js";
import jobRepository from "../job/job.repository.js";
import subscriptionRepository from "./subscription.repository.js";

/**
 * Service for handling user profile-related operations.
 * This service provides methods to complete the user's profile, update the profile information, upload the user's resume, and generate a signed URL for downloading the resume. It interacts with the user repository to manage user data and the academic repository to validate academic-related information such as branches and batches.
 */
class ProfileService {
	/**
	 * Completes the user's profile with the provided data.
	 * This method checks if the user exists and if their profile is not already completed. It also validates the provided branch and batch IDs against the academic repository. If all checks pass, it updates the user's profile with the new data and marks it as completed.
	 *
	 * @param {uuid} userId - The ID of the user whose profile is to be completed.
	 * @param {Object} payload - An object containing the profile data to be updated, such as branch_id, batch_id, cgpa, etc.
	 * @returns {Object} - The updated user data after completing the profile.
	 * @throws {AppError} - Throws an AppError if the user is not found, if the profile is already completed, or if the provided branch or batch IDs are invalid.
	 */
	async completeProfile(userId, payload) {
		const { subscribe_to_alerts, ...profilePayload } = payload;
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (user.profile_completed) {
			throw new AppError("Profile already completed", 400);
		}

		const branch = await academicRepository.findBranchById(payload.branch_id);
		if (!branch) throw new AppError("Branch not found", 404);

		const batch = await academicRepository.findBatchById(payload.batch_id);
		if (!batch) throw new AppError("Batch not found", 404);

		const updated = await userRepository.update(userId, {
			...profilePayload,
			profile_completed: true,
		});

		await subscriptionRepository.upsert(userId, {
			email_alerts: subscribe_to_alerts !== false,
		});

		return updated;
	}

	/**
	 * Updates the user's profile with the provided data.
	 * This method checks if the user exists and validates the provided branch and batch IDs against the academic repository. If all checks pass, it updates the user's profile with the new data.
	 *
	 * @param {uuid} userId - The ID of the user whose profile is to be updated.
	 * @param {Object} payload - An object containing the profile data to be updated.
	 * @returns {Object} - The updated user data.
	 * @throws {AppError} - Throws an AppError if the user is not found or if the provided branch or batch IDs are invalid.
	 */
	async updateProfile(userId, payload) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (payload.branch_id) {
			const branch = await academicRepository.findBranchById(payload.branch_id);
			if (!branch) throw new AppError("Branch not found", 404);
		}

		if (payload.batch_id) {
			const batch = await academicRepository.findBatchById(payload.batch_id);
			if (!batch) throw new AppError("Batch not found", 404);
		}

		const updated = await userRepository.update(userId, payload);

		return updated;
	}

	/**
	 * Uploads the user's resume to Supabase storage and updates the user's profile with the resume URL.
	 * This method checks if the user exists and then uploads the provided file to Supabase storage under a specific path. After a successful upload, it updates the user's profile with the URL of the uploaded resume.
	 * @param {uuid} userId - The ID of the user whose resume is to be uploaded.
	 * @param {Object} file - The file object containing the resume to be uploaded.
	 * @returns {Object} - The updated user data.
	 * @throws {AppError} - Throws an AppError if the user is not found or if the upload fails.
	 */
	async uploadResume(userId, file) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		const filePath = `resumes/${userId}.pdf`;

		const { error } = await supabase.storage.from("resumes").upload(filePath, file.buffer, {
			contentType: "application/pdf",
			upsert: true, // overwrite existing
		});

		if (error) {
			throw new AppError("Failed to upload resume", 500, false);
		}

		const updated = await userRepository.update(userId, {
			resume_url: filePath,
		});

		return updated;
	}

	/**
	 * Generates a signed URL for downloading the user's resume.
	 * This method checks if the user exists and has a resume uploaded. If so, it generates a signed URL that allows temporary access to the resume.
	 * @param {uuid} userId - The ID of the user whose resume URL is to be generated.
	 * @returns {string} - The signed URL for downloading the resume.
	 * @throws {AppError} - Throws an AppError if the user is not found or if no resume is uploaded.
	 */
	async getResumeDownloadUrl(userId) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (!user.resume_url) {
			throw new AppError("Resume not uploaded", 404);
		}

		const { data, error } = await supabase.storage.from("resumes").createSignedUrl(user.resume_url, 60);

		if (error) {
			throw new AppError("Failed to generate resume URL", 500, false);
		}

		return data.signedUrl;
	}

	/**
	 * Deletes the user's resume from storage and clears the resume URL.
	 * @param {uuid} userId - The ID of the user whose resume is to be deleted.
	 * @returns {Object} - The updated user data.
	 */
	async deleteResume(userId) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (!user.resume_url) {
			throw new AppError("Resume not uploaded", 404);
		}

		const { error } = await supabase.storage.from("resumes").remove([user.resume_url]);

		if (error) {
			throw new AppError("Failed to delete resume", 500, false);
		}

		const updated = await userRepository.update(userId, {
			resume_url: null,
		});

		return updated;
	}

	/**
	 * Returns profile stats for the current user.
	 * @param {Object} user - The authenticated user object.
	 * @returns {Object} - The profile stats payload.
	 */
	async getProfileStats(user) {
		const jobs = await jobRepository.listJobs();
		const visibleJobs = user.role === "admin" ? jobs : jobs.filter((job) => job.approval_status === "approved");

		let eligibleJobsCount = 0;
		if (user.profile_completed && user.role !== "admin") {
			const branchId = user.branch?.id;
			const batchId = user.batch?.id;
			const cgpa = user.cgpa;

			const eligibleJobs = await jobRepository.getFeed(branchId, batchId, cgpa);
			eligibleJobsCount = eligibleJobs.length;
		}

		return {
			total_jobs: visibleJobs.length,
			eligible_jobs: eligibleJobsCount,
			resume_uploaded: !!user.resume_url,
			profile_completed: !!user.profile_completed,
		};
	}

	/**
	 * Fetch notification preferences for the current user.
	 * @param {uuid} userId - The ID of the user.
	 * @returns {Object} - The notification preferences.
	 */
	async getNotificationPrefs(userId) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		const prefs = await subscriptionRepository.findByUserId(userId);

		if (!prefs) {
			return {
				user_id: userId,
				email_alerts: true,
				telegram_alerts: false,
				created_at: null,
			};
		}

		return prefs;
	}

	/**
	 * Update notification preferences for the current user.
	 * @param {uuid} userId - The ID of the user.
	 * @param {Object} payload - The notification preferences payload.
	 * @returns {Object} - The updated notification preferences.
	 */
	async updateNotificationPrefs(userId, payload) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		return subscriptionRepository.upsert(userId, {
			email_alerts: payload.email_alerts,
		});
	}

}

export default new ProfileService();
