import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class SubscriptionRepository {
	async upsert(userId, { email_alerts }) {
		const { data, error } = await supabase
			.schema("placement")
			.from("job_alert_subscriptions")
			.upsert(
				{
					user_id: userId,
					email_alerts,
				},
				{ onConflict: "user_id" },
			)
			.select()
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async findByUserId(userId) {
		const { data, error } = await supabase
			.schema("placement")
			.from("job_alert_subscriptions")
			.select(
				`
				user_id,
				email_alerts,
				telegram_alerts,
				created_at
			`,
			)
			.eq("user_id", userId)
			.single();

		if (error && error.code !== "PGRST116") {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data ?? null;
	}

	async getEligibleSubscribers(branchIds, batchIds) {
		const { data, error } = await supabase.schema("placement").rpc("get_eligible_subscribers", {
			p_branch_ids: branchIds,
			p_batch_ids: batchIds,
		});

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data ?? [];
	}

	async getAllSubscribers() {
		const { data, error } = await supabase.schema("placement").rpc("get_all_subscribers");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data ?? [];
	}
}

export default new SubscriptionRepository();
