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
			const { job_id: jobId } = req.query;
			const announcements = await announcementService.getAnnouncements(jobId);

			return new AppResponse({
				message: "Announcements fetched successfully",
				data: announcements,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}
}

const announcementController = new AnnouncementController();

export default announcementController;
