import AppResponse from "../../utils/AppResponse.js";
import announcementService from "./announcement.service.js";

class AnnouncementController {
	async createAnnouncement(req, res, next) {
		try {
			if (req.body.branches && typeof req.body.branches === "string") {
				req.body.branches = JSON.parse(req.body.branches);
			}
			if (req.body.batches && typeof req.body.batches === "string") {
				req.body.batches = JSON.parse(req.body.batches);
			}

			const announcement = await announcementService.createAnnouncement(req.user, req.body, req.file);

			return new AppResponse({
				message: "Announcement created successfully",
				data: announcement,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getAnnouncements(req, res, next) {
		try {
			const { announcements, total, page, limit, totalPages } = await announcementService.getAnnouncements(req.user, req.query);

			return new AppResponse({
				message: "Announcements fetched successfully",
				data: {
					announcements,
				},
				meta: {
					page,
					limit,
					total,
					totalPages,
				},
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getAnnouncementById(req, res, next) {
		try {
			const announcement = await announcementService.getAnnouncementById(req.params.id);

			return new AppResponse({
				message: "Announcement fetched successfully",
				data: announcement,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async updateAnnouncement(req, res, next) {
		try {
			if (req.body.branches && typeof req.body.branches === "string") {
				req.body.branches = JSON.parse(req.body.branches);
			}
			if (req.body.batches && typeof req.body.batches === "string") {
				req.body.batches = JSON.parse(req.body.batches);
			}

			const updated = await announcementService.updateAnnouncement(req.user, req.params.id, req.body, req.file);

			return new AppResponse({
				message: "Announcement updated successfully",
				data: updated,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async deleteAnnouncement(req, res, next) {
		try {
			await announcementService.deleteAnnouncement(req.user, req.params.id);

			return new AppResponse({
				message: "Announcement deleted (soft) successfully",
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async downloadCircular(req, res, next) {
		try {
			const { id } = req.params;
			const url = await announcementService.getCircularDownloadUrl(id);

			return new AppResponse({
				message: "Announcement circular URL generated",
				data: { url },
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async sendManualAlert(req, res, next) {
		try {
			const { id } = req.params;
			const result = await announcementService.sendManualAlert(req.user, id);

			return new AppResponse({
				message: "Email notifications dispatched successfully",
				data: result,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}
}

const announcementController = new AnnouncementController();

export default announcementController;
