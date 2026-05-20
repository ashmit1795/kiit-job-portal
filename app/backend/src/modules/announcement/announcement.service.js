import AppError from "../../utils/AppError.js";
import logger from "../../utils/logger.js";
import supabase from "../../config/supabase.js";
import announcementRepository from "./announcement.repository.js";
import jobRepository from "../job/job.repository.js";
import adminRepository from "../admin/admin.repository.js";

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
			announcement_priority: payload.announcement_priority ?? 0,
			created_by: user.id,
		});

		// Log admin action
		try {
			await adminRepository.insertLog({
				admin_id: user.id,
				action: "create_announcement",
				target_type: "announcement",
				target_id: announcement.id,
				details: JSON.stringify({ subject: payload.subject, job_id: jobId }),
			});
		} catch (e) {
			logger.warn("Failed to write admin log for announcement creation", e);
		}

		return { id: announcement.id };
	}

	async getAnnouncements({ job_id: jobId, page, limit }) {
		return announcementRepository.listAnnouncements({ jobId, page, limit });
	}

	async getAnnouncementById(announcementId) {
		const announcement = await announcementRepository.getAnnouncementById(announcementId);

		if (!announcement) {
			throw new AppError("Announcement not found", 404);
		}

		return announcement;
	}

	async getCircularDownloadUrl(announcementId) {
		const announcement = await announcementRepository.getAnnouncementById(announcementId);

		if (!announcement) {
			throw new AppError("Announcement not found", 404);
		}

		if (!announcement.circular_file_path) {
			throw new AppError("Circular file missing", 404);
		}

		const { data, error } = await supabase.storage.from("job-circulars").createSignedUrl(announcement.circular_file_path, 60);

		if (error) {
			logger.error("Announcement circular signed URL error:", error);
			throw new AppError("Failed to generate download URL", 500);
		}

		return data.signedUrl;
	}

	async updateAnnouncement(user, announcementId, payload, file) {
		const existing = await announcementRepository.getAnnouncementById(announcementId);
		if (!existing) throw new AppError("Announcement not found", 404);

		if (user.role === "volunteer" && existing.created_by !== user.id) {
			throw new AppError("You can only update your own announcements", 403);
		}

		let updates = {
			subject: payload.subject ?? existing.subject,
			description: payload.description ?? existing.description,
			announcement_type: payload.announcement_type ?? existing.announcement_type,
			is_pinned: payload.is_pinned !== undefined ? (payload.is_pinned === "true" || payload.is_pinned === true) : existing.is_pinned,
			announcement_priority: payload.announcement_priority ?? existing.announcement_priority,
		};

		if (payload.job_id) {
			const job = await jobRepository.findById(payload.job_id);
			if (!job) throw new AppError("Job not found", 404);
			updates.job_id = payload.job_id;
		}

		if (file) {
			const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
			const circularFilePath = `announcements/${Date.now()}-${safeName}`;

			const { error } = await supabase.storage.from("job-circulars").upload(circularFilePath, file.buffer, {
				contentType: "application/pdf",
				upsert: true,
			});

			if (error) {
				logger.error("Announcement circular upload error:", error);
				throw new AppError("Failed to upload announcement circular", 500);
			}

			updates.circular_file_path = circularFilePath;
		}

		const updated = await announcementRepository.updateAnnouncement(announcementId, updates);

		// Log admin action
		try {
			await adminRepository.insertLog({
				admin_id: user.id,
				action: "update_announcement",
				target_type: "announcement",
				target_id: announcementId,
				details: JSON.stringify({ updates }),
			});
		} catch (e) {
			logger.warn("Failed to write admin log for announcement update", e);
		}

		return updated;
	}

	async deleteAnnouncement(user, announcementId) {
		const existing = await announcementRepository.getAnnouncementById(announcementId);
		if (!existing) throw new AppError("Announcement not found", 404);

		if (user.role === "volunteer" && existing.created_by !== user.id) {
			throw new AppError("You can only delete your own announcements", 403);
		}

		const deleted = await announcementRepository.softDeleteAnnouncement(announcementId);

		// Log admin action
		try {
			await adminRepository.insertLog({
				admin_id: user.id,
				action: "delete_announcement",
				target_type: "announcement",
				target_id: announcementId,
				details: JSON.stringify({ previous: existing }),
			});
		} catch (e) {
			logger.warn("Failed to write admin log for announcement deletion", e);
		}

		return deleted;
	}
}

export default new AnnouncementService();
