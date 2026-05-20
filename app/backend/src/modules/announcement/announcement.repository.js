import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class AnnouncementRepository {
	async createAnnouncement(payload) {
		const { data, error } = await supabase.schema("placement").from("job_announcements").insert(payload).select("id").single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}

	async listAnnouncements({ jobId } = {}) {
		let query = supabase
			.schema("placement")
			.from("job_announcements")
			.select(
				`
				id,
				subject,
				description,
				job_id,
				circular_file_path,
				announcement_type,
				is_pinned,
				created_by,
				created_at,
				updated_at
			`,
			)
			.order("is_pinned", { ascending: false })
			.order("created_at", { ascending: false });

		if (jobId) {
			query = query.eq("job_id", jobId);
		}

		const { data, error } = await query;

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}
}

export default new AnnouncementRepository();
