import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class AnnouncementRepository {
	async createAnnouncement(payload) {
		const { data, error } = await supabase.schema("placement").from("job_announcements").insert(payload).select("id").single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

	async listAnnouncements({ jobId, page = 1, limit = 20 } = {}) {
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
				{ count: "exact" },
			)
			.order("is_pinned", { ascending: false })
			.order("created_at", { ascending: false });

		if (jobId) {
			query = query.eq("job_id", jobId);
		}

		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const { data, error, count } = await query.range(from, to);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return { announcements: data, total: count ?? 0 };
	}

	async getAnnouncementById(announcementId) {
		const { data, error } = await supabase
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
			.eq("id", announcementId)
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}
}

export default new AnnouncementRepository();
