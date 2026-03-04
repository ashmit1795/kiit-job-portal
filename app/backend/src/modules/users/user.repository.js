import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class UserRepository {
	async findById(userId) {
		const { data, error } = await supabase
			.schema("placement")
			.from("users")
			.select(
				`
					id,
					email,
					roll_number,
					role,
					profile_completed,
					cgpa,
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
					),
					batch:batches (
						id,
						year
					),
					tenth_percentage,
					twelfth_percentage,
					resume_url
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

	async create(userData) {
		const { data, error } = await supabase.schema("placement").from("users").insert(userData).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}
		return data;
	}

	async update(userId, updates) {
		const { data, error } = await supabase.schema("placement").from("users").update(updates).eq("id", userId).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async findByEmail(email) {
		const { data, error } = await supabase
			.schema("placement")
			.from("users")
			.select(
				`
					id,
					email,
					roll_number,
					role,
					profile_completed,
					cgpa,
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
					),
					batch:batches (
						id,
						year
					),
					tenth_percentage,
					twelfth_percentage,
					resume_url
				`,
			)
			.eq("email", email)
			.single();
		
		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}
}

export default new UserRepository();
