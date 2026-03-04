import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

/**
 * Repository for managing user data in the database.
 * This repository provides methods to find users by ID or email, create new users, and update existing users. It interacts with the Supabase database to perform these operations and uses a utility function to map any errors that occur during database interactions into standardized application errors.
 */
class UserRepository {
	/**
	 * Finds a user by their unique ID.
	 * This method retrieves a user from the database based on their unique ID. It returns the user's data, including their email, role, profile completion status, academic information, and resume URL. If the user is not found, it returns null. If any database error occurs during the query, it maps the error to a standardized application error and throws it.
	 *
	 * @param {uuid} userId - The ID of the user to be retrieved from the database.
	 * @returns {Object} - The user data if found, or null if no user is found with the specified ID.
	 * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
	 */
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

	/**
	 * Creates a new user in the database with the provided data.
	 * This method inserts a new user record into the database using the provided user data. It returns the created user's data, including their ID and email. If any database error occurs during the insertion, it maps the error to a standardized application error and throws it.
	 * 
	 * @param {Object} userData - The data for the new user to be created.
	 * @returns {Object} - The created user's data.
	 * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
	 */
	async create(userData) {
		const { data, error } = await supabase.schema("placement").from("users").insert(userData).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}
		return data;
	}

	/**
	 * Updates an existing user's data in the database.
	 * This method updates a user record in the database based on the provided user ID and update data. It returns the updated user's data. If any database error occurs during the update, it maps the error to a standardized application error and throws it.
	 * 
	 * @param {uuid} userId - The ID of the user to be updated.
	 * @param {Object} updates - An object containing the fields to be updated and their new values.
	 * @returns {Object} - The updated user's data.
	 * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
	 */
	async update(userId, updates) {
		const { data, error } = await supabase.schema("placement").from("users").update(updates).eq("id", userId).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	/**
	 * Finds a user by their email address.
	 * This method retrieves a user from the database based on their email address. It returns the user's data, including their ID, role, profile completion status, academic information, and resume URL. If the user is not found, it returns null. If any database error occurs during the query, it maps the error to a standardized application error and throws it.
	 *
	 * @param {string} email - The email address of the user to be retrieved from the database.
	 * @returns {Object} - The user data if found, or null if no user is found with the specified email.
	 * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
	 */
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
