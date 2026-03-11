import supabase from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class JobRepository {
	/**
	 * Creates a job using the Postgres RPC function `create_job`.
	 * This ensures atomic insertion of:
	 * - jobs
	 * - job_eligible_branches
	 * - job_eligible_batches
	 */
	async createJob(payload) {
		const { data, error } = await supabase.schema("placement").rpc("create_job", payload);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}

	/**
	 * Fetch a single job by ID with populated eligibility data.
	 */
	async findById(jobId) {
		const { data, error } = await supabase
			.schema("placement")
			.from("jobs")
			.select(
				`
				id,
				circular_number,
				company_name,
				role_title,
				job_type,
				ctc,
				min_cgpa,
				deadline,
				description,
				circular_file_path,
				approval_status,
				is_active,
				created_at,
				posted_by,
                stipend,
                joining_date,
				eligible_branches:job_eligible_branches (
					branch:branches (
						id,
						name,
						code,
						program:programs (
							id,
							name,
							level,
							duration_years
						)
					)
				),
				eligible_batches:job_eligible_batches (
					batch:batches (
						id,
						year
					)
				),
                locations:job_locations (
                    location
                )
			`,
			)
			.eq("id", jobId)
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	/**
	 * Fetch all jobs with populated eligibility data.
	 */
	async listJobs() {
		const { data, error } = await supabase
			.schema("placement")
			.from("jobs")
			.select(
				`
				id,
				circular_number,
				company_name,
				role_title,
				job_type,
				ctc,
				min_cgpa,
				deadline,
				description,
				circular_file_path,
				approval_status,
				is_active,
				created_at,
				posted_by,
                stipend,
                joining_date,
				eligible_branches:job_eligible_branches (
					branch:branches (
						id,
						name,
						code,
                        program:programs (
							id,
							name,
							level,
							duration_years
						)
					)
				),
				eligible_batches:job_eligible_batches (
					batch:batches (
						id,
						year
					)
				),
                locations:job_locations (
                    location
                )
			`,
			)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	/**
	 * Update job approval status
	 */
	async updateApproval(jobId, status) {
		const { data, error } = await supabase
			.schema("placement")
			.from("jobs")
			.update({ approval_status: status })
			.eq("id", jobId)
			.select(
				`
				id,
				circular_number,
				company_name,
				role_title,
				job_type,
				ctc,
				min_cgpa,
				deadline,
				description,
				circular_file_path,
				approval_status,
				is_active,
				created_at,
				posted_by
			`,
			)
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async findByCircularNumber(circularNumber) {
		const { data, error } = await supabase.schema("placement").from("jobs").select("id").eq("circular_number", circularNumber);

		if (error && error.code !== "PGRST116") {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async findByCircularAndRole(circularNumber, roleTitle) {
		const { data, error } = await supabase
			.schema("placement")
			.from("jobs")
			.select("id")
			.eq("circular_number", circularNumber)
			.eq("role_title", roleTitle)
			.single();

		if (error && error.code !== "PGRST116") {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}
}

export default new JobRepository();
