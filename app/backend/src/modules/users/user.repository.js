import supabase from "../../config/supabase.js";
import logger from "../../utils/logger.js";

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
					)
				`,
			)
			.eq("id", userId)
			.single();

		if (error && error.code !== "PGRST116") {
			logger.error("Error fetching user by ID", {
				userId,
				message: error.message,
			});
			throw error;
		}

		return data;
	}

	async create(userData) {
		const { data, error } = await supabase.schema("placement").from("users").insert(userData).select().single();

		if (error) {
			logger.error("Error creating user", {
				message: error.message,
				userData,
			});
			throw error;
		}

		return data;
	}

	async update(userId, updates) {
		const { data, error } = await supabase.schema("placement").from("users").update(updates).eq("id", userId).select().single();

		if (error) {
			logger.error("Error updating user", {
				userId,
				message: error.message,
			});
			throw error;
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
					)
				`,
			)
			.eq("email", email)
			.single();
		
		// PGRST116 = no rows found
		if (error && error.code !== "PGRST116") {
			logger.error("Error fetching user by email", {
				email,
				message: error.message,
			});
			throw error;
		}

		return data;
	}
}

export default new UserRepository();
