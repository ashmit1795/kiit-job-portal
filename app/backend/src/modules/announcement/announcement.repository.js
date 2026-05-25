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
				circular_number,
				announcement_type,
				is_pinned,
				alert_sent,
					announcement_priority,
					created_by,
					created_at,
					updated_at,
					created_by_user:users(
						id,
						full_name,
						avatar_url,
						role
					),
					job:jobs(
						id,
						company_name,
						role_title,
						circular_number
					)
				`,
				{ count: "exact" },
			)
			.order("is_pinned", { ascending: false })
			.order("announcement_priority", { ascending: false })
			.order("created_at", { ascending: false });

		if (jobId) {
			query = query.eq("job_id", jobId);
		}

		query = query.eq("is_active", true);

		const pageNum = parseInt(page, 10) || 1;
		const limitNum = parseInt(limit, 10) || 20;

		const from = (pageNum - 1) * limitNum;
		const to = from + limitNum - 1;

		const { data, error, count } = await query.range(from, to);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		const total = count ?? 0;
		const totalPages = Math.ceil(total / limitNum);

		return { announcements: data, total, page: pageNum, limit: limitNum, totalPages };
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
					circular_number,
					announcement_type,
					is_pinned,
					alert_sent,
					announcement_priority,
					created_by,
					created_at,
					updated_at,
					created_by_user:users(
						id,
						full_name,
						avatar_url,
						role
					),
					job:jobs(
						id,
						company_name,
						role_title,
						circular_number
					)
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

	async updateAnnouncement(announcementId, updates) {
		const { data, error } = await supabase
			.schema("placement")
			.from("job_announcements")
			.update(updates)
			.eq("id", announcementId)
			.select("id, subject, description, job_id, circular_file_path, circular_number, announcement_type, is_pinned, announcement_priority, created_by, created_at, updated_at, alert_sent")
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}

	async softDeleteAnnouncement(announcementId) {
		const { data, error } = await supabase
			.schema("placement")
			.from("job_announcements")
			.update({ is_active: false })
			.eq("id", announcementId)
			.select("id");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}

	async markAlertSent(announcementId, status = true) {
		const { data, error } = await supabase
			.schema("placement")
			.from("job_announcements")
			.update({ alert_sent: status })
			.eq("id", announcementId)
			.select("id, alert_sent")
			.single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data;
	}

	async getAllSubscribers() {
		const { data, error } = await supabase.schema("placement").rpc("get_all_subscribers");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		return data ?? [];
	}
}

export default new AnnouncementRepository();
