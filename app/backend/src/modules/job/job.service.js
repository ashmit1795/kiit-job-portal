import jobRepository from "./job.repository.js";
import AppError from "../../utils/AppError.js";
import supabase from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import adminRepository from "../admin/admin.repository.js";
import { inngest } from "../../inngest/client.js";

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
			p_apply_link_1: payload.apply_link_1 ?? null,
			p_apply_link_2: payload.apply_link_2 ?? null,
			p_circular_file_path: filePath,
			p_posted_by: user.id,
			p_approval_status: approvalStatus,
			p_branches: payload.branches,
			p_batches: payload.batches,
			p_locations: payload.locations ?? [],
			p_created_at: payload.created_at ?? null,
		});

		if (approvalStatus === "approved") {
			const job = await jobRepository.findById(jobId);
			if (job) {
				await inngest.send({
					name: "job/posted",
					data: this.buildJobPostedPayload(job),
				});
			}
		}

		return { id: jobId };
	}

	async getJobs(user) {
		const approvalStatus = (user.role === "student" || user.role === "volunteer") ? "approved" : null;
		const jobs = await jobRepository.listJobs(approvalStatus);

		let filteredJobs = jobs;

		// Sort: Open opportunities first, then closed ones. In each group, sort by created_at desc (newest first).
		const now = new Date();
		filteredJobs.sort((a, b) => {
			const aClosed = new Date(a.deadline) < now;
			const bClosed = new Date(b.deadline) < now;

			if (aClosed !== bClosed) {
				return aClosed ? 1 : -1;
			}

			return new Date(b.created_at) - new Date(a.created_at);
		});

		return filteredJobs.map((job) => this.formatJob(job));
	}

	async getJobById(user, jobId) {
		const job = await jobRepository.findById(jobId);

		if (!job) {
			throw new AppError("Job not found", 404);
		}

		const isOwner = user?.id && job.posted_by === user.id;
		const isAdmin = user?.role === "admin";

		if (job.approval_status !== "approved" && !isAdmin && !isOwner) {
			throw new AppError("Access denied", 403);
		}

		return this.formatJob(job);
	}

	async approveJob(user, jobId) {
		if (user.role !== "admin") {
			throw new AppError("Only admins can approve jobs", 403);
		}

		const job = await jobRepository.updateApproval(jobId, "approved");
		if (!job) {
			throw new AppError("Job not found", 404);
		}

		await adminRepository.insertLog({
			admin_id: user.id,
			action: "approve_job",
			target_type: "job",
			target_id: job.id,
			details: {
				company_name: job.company_name,
				role_title: job.role_title,
				circular_number: job.circular_number,
				approval_status: job.approval_status,
			},
		});

		const fullJob = await jobRepository.findById(job.id);
		if (fullJob) {
			await inngest.send({
				name: "job/posted",
				data: this.buildJobPostedPayload(fullJob),
			});
		}

		return job;
	}

	async rejectJob(user, jobId) {
		if (user.role !== "admin") {
			throw new AppError("Only admins can reject jobs", 403);
		}

		const job = await jobRepository.updateApproval(jobId, "rejected");
		if (!job) {
			throw new AppError("Job not found", 404);
		}

		await adminRepository.insertLog({
			admin_id: user.id,
			action: "reject_job",
			target_type: "job",
			target_id: job.id,
			details: {
				company_name: job.company_name,
				role_title: job.role_title,
				circular_number: job.circular_number,
				approval_status: job.approval_status,
			},
		});

		return job;
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

	async updateJob(user, jobId, payload, file) {
		const existing = await jobRepository.findById(jobId);
		if (!existing) {
			throw new AppError("Job not found", 404);
		}

		if (user.role === "volunteer" && existing.posted_by !== user.id) {
			throw new AppError("You can only update your own job postings", 403);
		}

		let circularFilePath = existing.circular_file_path;

		if (file) {
			circularFilePath = `circulars/${payload.circular_number || existing.circular_number}.pdf`;
			const { error } = await supabase.storage.from("job-circulars").upload(circularFilePath, file.buffer, {
				contentType: "application/pdf",
				upsert: true,
			});

			if (error) {
				logger.error("Supabase storage upload error:", error);
				throw new AppError("Failed to upload circular file", 500);
			}
		}

		// Keep approval status unchanged
		const approvalStatus = existing.approval_status;

		await jobRepository.updateJob({
			p_job_id: jobId,
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
			p_apply_link_1: payload.apply_link_1 ?? null,
			p_apply_link_2: payload.apply_link_2 ?? null,
			p_circular_file_path: circularFilePath,
			p_approval_status: approvalStatus,
			p_branches: payload.branches,
			p_batches: payload.batches,
			p_locations: payload.locations ?? [],
			p_created_at: payload.created_at ?? null,
		});

		// Log admin or volunteer action
		try {
			await adminRepository.insertLog({
				admin_id: user.id,
				action: "update_job",
				target_type: "job",
				target_id: jobId,
				details: {
					company_name: payload.company_name,
					role_title: payload.role_title,
					circular_number: payload.circular_number,
				},
			});
		} catch (e) {
			logger.warn("Failed to write log for job update", e);
		}

		const updated = await jobRepository.findById(jobId);
		return this.formatJob(updated);
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
			apply_link_1: job.apply_link_1,
			apply_link_2: job.apply_link_2,
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

	buildJobPostedPayload(job) {
		return {
			job_id: job.id,
			company_name: job.company_name,
			role_title: job.role_title,
			job_type: job.job_type,
			deadline: job.deadline,
			ctc: job.ctc,
			stipend: job.stipend,
			min_cgpa: job.min_cgpa,
			apply_link_1: job.apply_link_1,
			branch_ids: job.eligible_branches?.map((b) => b.branch?.id).filter(Boolean) ?? [],
			batch_ids: job.eligible_batches?.map((b) => b.batch?.id).filter(Boolean) ?? [],
		};
	}
}

export default new JobService();
