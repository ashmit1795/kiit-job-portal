import AppResponse from "../../utils/AppResponse.js";
import jobService from "./job.service.js";

class JobController {
	async createJob(req, res, next) {
		try {
			const job = await jobService.createJob(req.user, req.body, req.file);

			return new AppResponse({
				message: "Job created successfully",
				data: job,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getJobs(req, res, next) {
		try {
			const jobs = await jobService.getJobs(req.user);

			return new AppResponse({
				message: "Jobs fetched successfully",
				data: jobs,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getJobById(req, res, next) {
		try {
			const job = await jobService.getJobById(req.user, req.params.id);

			return new AppResponse({
				message: "Job details fetched successfully",
				data: job,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async approveJob(req, res, next) {
		try {
			const job = await jobService.approveJob(req.user, req.params.id);

			return new AppResponse({
				message: "Job approved successfully",
				data: job,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async rejectJob(req, res, next) {
		try {
			const job = await jobService.rejectJob(req.user, req.params.id);

			return new AppResponse({
				message: "Job rejected successfully",
				data: job,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getJobFeed(req, res, next) {
		try {
			const jobs = await jobService.getJobFeed(req.user);

			return new AppResponse({
				message: "Job feed fetched successfully",
				data: jobs,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async downloadCircular(req, res, next) {
		try {
			const { id } = req.params;

			const url = await jobService.getCircularDownloadUrl(id);

			return new AppResponse({
				message: "Circular download URL generated",
				data: { url },
			}).send(res);
		} catch (err) {
			next(err);
		}
	}
}

const jobController = new JobController();

export default jobController;
