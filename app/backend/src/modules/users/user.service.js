import userRepository from "./user.repository.js";
import AppError from "../../utils/AppError.js";
import env from "../../config/env.js";

/**
 * Service for handling user-related operations.
 * This service provides methods to synchronize user data from Supabase, extract roll numbers from email addresses, and manage user profiles. It interacts with the user repository to manage user data in the database and contains business logic related to user management, such as determining user roles based on email addresses.
 */
class UserService {
	/**
	 * Extracts the roll number from a KIIT email address.
	 * This method takes a KIIT email address and extracts the roll number from it. It throws an error if the email format is invalid.
	 *
	 * @param {string} email - The KIIT email address from which to extract the roll number.
	 * @returns {string} - The extracted roll number.
	 * @throws {AppError} - Throws an AppError if the email format is invalid.
	 */
	extractRollNumber(email) {
		const roll = email.split("@")[0];

		if (!/^\d+$/.test(roll)) {
			throw new AppError("Invalid KIIT email format", 400);
		}

		return roll;
	}

	/**
	 * Synchronizes user data from Supabase to the local database.
	 * This method checks if a user with the given Supabase user ID already exists in the local database. If not, it creates a new user record based on the information from the Supabase user object. It also determines the user's role based on their email address and sets the profile completion status accordingly.
	 * @param {Object} supabaseUser - The user object retrieved from Supabase, containing information such as the user's ID and email.
	 * @returns {Object} - The synchronized user data from the local database.
	 * @throws {AppError} - Throws an AppError if the email format is invalid or if any database error occurs during user creation.
	 */
	async syncUser(supabaseUser) {
		let user = await userRepository.findById(supabaseUser.id);

		if (!user) {
			const rollNumber = this.extractRollNumber(supabaseUser.email);

			let role = "student";

			// Bootstrap admin only in non-production
			if (env.NODE_ENV !== "production" && env.ADMIN_EMAILS.includes(supabaseUser.email)) {
				role = "admin";
			}

			user = await userRepository.create({
				id: supabaseUser.id,
				email: supabaseUser.email,
				roll_number: rollNumber,
				profile_completed: role === "admin" ? true : false, // Admins don't need to complete profile
			});
		}

		return user;
	}
}

export default new UserService();
