import userRepository from "./user.repository.js";
import AppError from "../../utils/AppError.js";

class UserService {
	extractRollNumber(email) {
		const roll = email.split("@")[0];

		if (!/^\d+$/.test(roll)) {
			throw new AppError("Invalid KIIT email format", 400);
		}

		return roll;
	}

	async syncUser(supabaseUser) {
		let user = await userRepository.findById(supabaseUser.id);

		if (!user) {
			const rollNumber = this.extractRollNumber(supabaseUser.email);

			let role = "student";

			// Bootstrap admin only in non-production
			if (env.NODE_ENV !== "production" && env.ADMIN_EMAILS.includes(email)) {
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
