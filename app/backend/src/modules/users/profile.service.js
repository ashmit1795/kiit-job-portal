import supabase from "../../config/supabase.js";
import AppError from "../../utils/AppError.js";
import userRepository from "./user.repository.js";
import academicRepository from "../academics/academic.repository.js";


class ProfileService {
	async completeProfile(userId, payload) {
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
			...payload,
			profile_completed: true,
		});

		return updated;
	}

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
}

export default new ProfileService();
