import supabase from "../../config/supabase.js";
import AppError from "../../utils/AppError.js";

class ProfileService {
	async completeProfile(userId, payload) {
		const { branch_id, batch_id, cgpa } = payload;

		if (!branch_id || !batch_id || cgpa === undefined) {
			throw new AppError("All profile fields are required", 400);
		}

		if (cgpa < 0 || cgpa > 10) {
			throw new AppError("Invalid CGPA value", 400);
		}

        const { data, error } = await supabase
            .schema("placement")
			.from("users")
			.update({
				branch_id,
				batch_id,
				cgpa,
				profile_completed: true,
			})
			.eq("id", userId)
			.select()
			.single();

		if (error) throw error;

		return data;
	}
}

export default new ProfileService();
