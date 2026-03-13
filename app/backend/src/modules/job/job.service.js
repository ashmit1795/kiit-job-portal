import jobRepository from "./job.repository.js";
import AppError from "../../utils/AppError.js";
import supabase from "../../config/supabase.js";
import logger from "../../utils/logger.js";

class JobService {
	async createJob(user, payload, file) {
		let approvalStatus = "pending";

		if (user.role === "admin") {
			approvalStatus = "approved";
		}

		/* =========================
		Check duplicate role
		========================= */

		const existing = await jobRepository.findByCircularAndRole(payload.circular_number, payload.role_title);
		if (existing) {
			throw new AppError("Job with this circular number and role already exists", 409);
		}

		/* =========================
		Circular Upload
		========================= */

		if (!file) {
			throw new AppError("Circular file is required", 400);
		}

		const filePath = `circulars/${payload.circular_number}.pdf`;

		const { error } = await supabase.storage.from("job-circulars").upload(filePath, file.buffer, {
			contentType: "application/pdf",
			upsert: true,
		});

		if (error) {
			logger.error("Supabase storage upload error:", error);
			throw new AppError("Failed to upload circular file", 500);
		}

		/* =========================
		Create Job
		========================= */

		const jobId = await jobRepository.createJob({
			p_circular_number: payload.circular_number,
			p_company_name: payload.company_name,
			p_role_title: payload.role_title,
			p_job_type: payload.job_type,
			p_ctc: payload.ctc ?? null,
			p_stipend: payload.stipend ?? null,
			p_min_cgpa: payload.min_cgpa ?? null,
			p_deadline: payload.deadline,
			p_joining_date: payload.joining_date ?? null,
			p_description: payload.description ?? null,
			p_circular_file_path: filePath,
			p_posted_by: user.id,
			p_approval_status: approvalStatus,
			p_branches: payload.branches,
			p_batches: payload.batches,
			p_locations: payload.locations ?? [],
		});

		return { id: jobId };
	}

	async getJobs(user) {
		const jobs = await jobRepository.listJobs();

		let filteredJobs = jobs;

		if (user.role === "student" || user.role === "volunteer") {
			filteredJobs = jobs.filter((job) => job.approval_status === "approved");
		}

		return filteredJobs.map((job) => this.formatJob(job));
	}

	async getJobById(jobId) {
		const job = await jobRepository.findById(jobId);

		if (!job) {
			throw new AppError("Job not found", 404);
		}

		return this.formatJob(job);
	}

	async approveJob(user, jobId) {
		if (user.role !== "admin") {
			throw new AppError("Only admins can approve jobs", 403);
		}

		return jobRepository.updateApproval(jobId, "approved");
	}

	async rejectJob(user, jobId) {
		if (user.role !== "admin") {
			throw new AppError("Only admins can reject jobs", 403);
		}

		return jobRepository.updateApproval(jobId, "rejected");
	}

	async getJobFeed(user) {
		if (!user.profile_completed) {
			throw new AppError("Complete profile to view job feed", 403);
		}

		const branchId = user.branch?.id;
		const batchId = user.batch?.id;
		const cgpa = user.cgpa;

		const jobs = await jobRepository.getFeed(branchId, batchId, cgpa);

		return jobs.map((job) => this.formatJob(job));
	}

	async getCircularDownloadUrl(jobId) {
		const job = await jobRepository.findById(jobId);

		if (!job) {
			throw new AppError("Job not found", 404);
		}

		if (job.approval_status !== "approved") {
			throw new AppError("Circular not available", 403);
		}

		if (!job.circular_file_path) {
			throw new AppError("Circular file missing", 404);
		}

		const { data, error } = await supabase.storage.from("job-circulars").createSignedUrl(job.circular_file_path, 60);

		if (error) {
			logger.error("Circular signed URL error:", error);
			throw new AppError("Failed to generate download URL", 500);
		}

		return data.signedUrl;
	}

	formatJob(job) {
		return {
			id: job.id,
			circular_number: job.circular_number,
			company_name: job.company_name,
			role_title: job.role_title,
			job_type: job.job_type,
			ctc: job.ctc,
			stipend: job.stipend,
			min_cgpa: job.min_cgpa,
			deadline: job.deadline,
			description: job.description,
			circular_file_path: job.circular_file_path,
			approval_status: job.approval_status,
			is_active: job.is_active,
			created_at: job.created_at,
			posted_by: job.posted_by,
			joining_date: job.joining_date,

			locations: job.locations?.map((l) => l.location) ?? [],

			eligible_branches:
				job.eligible_branches?.map((b) => ({
					id: b.branch.id,
					code: b.branch.code,
					name: b.branch.name,
					program_name: b.branch.program?.name,
					program_level: b.branch.program?.level,
				})) ?? [],

			eligible_batches:
				job.eligible_batches?.map((b) => ({
					id: b.batch.id,
					year: b.batch.year,
				})) ?? [],
		};
	}
}

export default new JobService();
