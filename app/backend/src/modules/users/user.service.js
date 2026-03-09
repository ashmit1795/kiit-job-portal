import userRepository from "./user.repository.js";
import AppError from "../../utils/AppError.js";
import env from "../../config/env.js";

/**
 * Service for handling user-related operations.
 * This service provides methods to synchronize user data from Supabase, extract roll numbers from email addresses, and manage user profiles. It interacts with the user repository to manage user data in the database and contains business logic related to user management, such as determining user roles based on email addresses.
 */
class UserService {
	/**
	 * This method takes a KIIT email address and extracts the roll number from it. It checks if the local part of the email (the part before the @ symbol) consists entirely of digits, which is the expected format for KIIT student emails. If the format is valid, it returns the local part as the roll number; otherwise, it returns null.
	 *
	 * @param {string} email - The KIIT email address from which to extract the roll number.
	 * @returns {string|null} - The extracted roll number or null if not found.
	 * @throws {AppError} - Throws an AppError if the email format is invalid.
	 */
	extractRollNumber(email) {
		const localPart = email.split("@")[0];

		if (/^\d+$/.test(localPart)) {
			return localPart;
		}

		return null;
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

		if (user) return user;

		const email = supabaseUser.email;

		if (!email.endsWith("@kiit.ac.in") && !env.ADMIN_EMAILS.includes(email)) {
			throw new AppError("Unauthorized email domain", 403);
		}

		const rollNumber = this.extractRollNumber(email);

		let role = "student";

		if (env.ADMIN_EMAILS.includes(email)) {
			role = "admin";
		}

		const newUser = await userRepository.create({
			id: supabaseUser.id,
			email,
			roll_number: rollNumber,
			role,
			profile_completed: role === "admin",
		});

		return newUser;
	}
}

export default new UserService();
