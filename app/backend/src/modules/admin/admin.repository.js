import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";
import AppError from "../../utils/AppError.js";

class AdminRepository {
	/**
	 * Inserts an admin audit log entry.
	 * @param {Object} payload - Log payload for the admin action.
	 * @return {Object} - Inserted log row.
	 */
	async insertLog(payload) {
		const { data, error } = await supabase.schema("placement").from("admin_logs").insert(payload).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async getDashboardStats() {
		const { data, error } = await supabase.schema("placement").rpc("admin_dashboard_stats");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async listUsers({ page = 1, limit = 20, role, search }) {
		let query = supabase
			.schema("placement")
			.from("users")
			.select(
				`
				id,
				email,
                full_name,
                avatar_url,
                roll_number,
				role,
				profile_completed,
				cgpa,
				branch:branches(
					id,
					name,
					code
				),
				batch:batches(
					id,
					year
				)
			`,
				{ count: "exact" },
			);

		if (role) query = query.eq("role", role);

		if (search) query = query.ilike("email", `%${search}%`);

		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return { users: data, total: count };
	}

	async getUserById(userId) {
		const { data, error } = await supabase
			.schema("placement")
			.from("users")
			.select(
				`
				id,
				email,
                full_name,
                avatar_url,
                roll_number,
				role,
				profile_completed,
				cgpa,
				tenth_percentage,
				twelfth_percentage,
				resume_url,
				branch:branches(
					id,
					name,
					code
				),
				batch:batches(
					id,
					year
				)
			`,
			)
			.eq("id", userId)
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async updateUserRole(userId, role) {
		const { data, error } = await supabase.schema("placement").from("users").update({ role }).eq("id", userId).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async deactivateUser(userId) {
		const { data, error } = await supabase.schema("placement").from("users").delete().eq("id", userId);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async jobStats() {
		const { data, error } = await supabase.schema("placement").rpc("job_stats");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	/**
	 * Fetch all jobs for admin with filters and pagination.
	 * @param {Object} query - Query params.
	 * @return {Object} - Jobs list with total count.
	 */
	async listAllJobs({ page = 1, limit = 20, status, type, search }) {
		let query = supabase
			.schema("placement")
			.from("jobs")
			.select(
				`
				id,
				circular_number,
				company_name,
				role_title,
				job_type,
				approval_status,
				deadline,
				created_at,
				is_active,
				posted_by,
				posted_by_user:users(
					id,
					full_name,
					email,
					avatar_url
				)
			`,
				{ count: "exact" },
			)
			.eq("is_active", true);

		if (status) query = query.eq("approval_status", status);
		if (type) query = query.eq("job_type", type);
		if (search) {
			query = query.or(`company_name.ilike.%${search}%,circular_number.ilike.%${search}%`);
		}

		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return { jobs: data, total: count };
	}

	/**
	 * Fetch all jobs posted by a specific user.
	 * @param {string} userId - User ID.
	 * @return {Array} - Jobs posted by the user.
	 */
	async getUserJobs(userId) {
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
				approval_status,
				deadline,
				created_at,
				is_active
			`,
			)
			.eq("posted_by", userId)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	/**
	 * Fetch admin audit logs with pagination.
	 * @param {Object} query - Query params.
	 * @return {Object} - Logs list with total count.
	 */
	async getLogs({ page = 1, limit = 20, action }) {
		let query = supabase
			.schema("placement")
			.from("admin_logs")
			.select(
				`
				id,
				admin_id,
				action,
				target_type,
				target_id,
				details,
				created_at,
				admin:users(
					id,
					full_name,
					email,
					avatar_url
				)
			`,
				{ count: "exact" },
			);

		if (action) query = query.eq("action", action);

		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return { logs: data, total: count };
	}
}

export default new AdminRepository();
