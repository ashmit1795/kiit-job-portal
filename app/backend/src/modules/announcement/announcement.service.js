import AppError from "../../utils/AppError.js";
import logger from "../../utils/logger.js";
import supabase from "../../config/supabase.js";
import announcementRepository from "./announcement.repository.js";
import jobRepository from "../job/job.repository.js";

class AnnouncementService {
	async createAnnouncement(user, payload, file) {
		let jobId = payload.job_id ?? null;

		if (jobId) {
			const job = await jobRepository.findById(jobId);
			if (!job) {
				throw new AppError("Job not found", 404);
			}
		}

		let circularFilePath = null;

		if (file) {
			const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
			circularFilePath = `announcements/${Date.now()}-${safeName}`;

			const { error } = await supabase.storage.from("job-circulars").upload(circularFilePath, file.buffer, {
				contentType: "application/pdf",
				upsert: true,
			});

			if (error) {
				logger.error("Announcement circular upload error:", error);
				throw new AppError("Failed to upload announcement circular", 500);
			}
		}

		const announcement = await announcementRepository.createAnnouncement({
			subject: payload.subject,
			description: payload.description,
			job_id: jobId,
			circular_file_path: circularFilePath,
			announcement_type: payload.announcement_type,
			is_pinned: payload.is_pinned ?? false,
			created_by: user.id,
		});

		return { id: announcement.id };
	}

	async getAnnouncements(jobId) {
		return announcementRepository.listAnnouncements({ jobId });
	}
}

export default new AnnouncementService();
