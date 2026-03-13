import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";
import AppError from "../../utils/AppError.js";

class AdminRepository {
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
}

export default new AdminRepository();
