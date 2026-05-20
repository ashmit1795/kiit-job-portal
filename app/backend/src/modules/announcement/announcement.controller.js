import AppResponse from "../../utils/AppResponse.js";
import announcementService from "./announcement.service.js";

class AnnouncementController {
	async createAnnouncement(req, res, next) {
		try {
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
			const { announcements, total } = await announcementService.getAnnouncements(req.query);

			return new AppResponse({
				message: "Announcements fetched successfully",
				data: {
					announcements,
					total,
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
}

const announcementController = new AnnouncementController();

export default announcementController;
