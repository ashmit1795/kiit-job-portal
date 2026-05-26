import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

class AnnouncementRepository {
	formatAnnouncement(ann) {
		if (!ann) return null;
		return {
			...ann,
			eligible_branches: ann.eligible_branches?.map((b) => ({
				id: b.branch?.id || b.id,
				code: b.branch?.code || b.code,
				name: b.branch?.name || b.name,
			})) ?? [],
			eligible_batches: ann.eligible_batches?.map((b) => ({
				id: b.batch?.id || b.id,
				year: b.batch?.year || b.year,
			})) ?? [],
		};
	}

	async createAnnouncement(payload, branchIds = [], batchIds = []) {
		const { data, error } = await supabase.schema("placement").from("job_announcements").insert(payload).select("id").single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		// Insert eligible branches if standalone and branch targets provided
		if (!payload.job_id && branchIds && branchIds.length > 0) {
			const branchRows = branchIds.map(branchId => ({ announcement_id: data.id, branch_id: branchId }));
			const { error: branchError } = await supabase.schema("placement").from("announcement_eligible_branches").insert(branchRows);
			if (branchError) {
				const mapped = mapSupabaseError(branchError);
				if (mapped) throw mapped;
				throw branchError;
			}
		}

		// Insert eligible batches if standalone and batch targets provided
		if (!payload.job_id && batchIds && batchIds.length > 0) {
			const batchRows = batchIds.map(batchId => ({ announcement_id: data.id, batch_id: batchId }));
			const { error: batchError } = await supabase.schema("placement").from("announcement_eligible_batches").insert(batchRows);
			if (batchError) {
				const mapped = mapSupabaseError(batchError);
				if (mapped) throw mapped;
				throw batchError;
			}
		}

		return data;
	}

	async listAnnouncements({ jobId, page = 1, limit = 20, branchId, batchId, userRole } = {}) {
		const pageNum = parseInt(page, 10) || 1;
		const limitNum = parseInt(limit, 10) || 20;
		const from = (pageNum - 1) * limitNum;
		const to = from + limitNum - 1;

		// 1. If jobId is provided, bypass branch/batch filtering entirely and show all updates for this specific job posting page
		if (jobId) {
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
					),
					eligible_branches:announcement_eligible_branches(
						branch:branches(
							id,
							name,
							code
						)
					),
					eligible_batches:announcement_eligible_batches(
						batch:batches(
							id,
							year
						)
					)
					`,
					{ count: "exact" },
				)
				.eq("job_id", jobId)
				.eq("is_active", true)
				.order("is_pinned", { ascending: false })
				.order("announcement_priority", { ascending: false })
				.order("created_at", { ascending: false })
				.range(from, to);

			const { data, error, count } = await query;

			if (error) {
				const mapped = mapSupabaseError(error);
				if (mapped) throw mapped;
				throw error;
			}

			const formattedData = data?.map(ann => this.formatAnnouncement(ann)) ?? [];
			const total = count ?? 0;
			const totalPages = Math.ceil(total / limitNum);

			return { announcements: formattedData, total, page: pageNum, limit: limitNum, totalPages };
		}

		// 2. Main Announcement Feed for students & volunteers: apply branch/batch targeted eligibility filtering
		if ((userRole === "student" || userRole === "volunteer") && branchId && batchId) {
			// Call high-performance RPC for targeted announcements feed
			const { data, error, count } = await supabase
				.schema("placement")
				.rpc("get_announcement_feed", {
					p_branch_id: branchId,
					p_batch_id: batchId,
				}, { count: "exact" })
				.order("is_pinned", { ascending: false })
				.order("announcement_priority", { ascending: false })
				.order("created_at", { ascending: false })
				.range(from, to);

			if (error) {
				const mapped = mapSupabaseError(error);
				if (mapped) throw mapped;
				throw error;
			}

			const formattedData = data?.map(ann => this.formatAnnouncement(ann)) ?? [];
			const total = count ?? 0;
			const totalPages = Math.ceil(total / limitNum);

			return { announcements: formattedData, total, page: pageNum, limit: limitNum, totalPages };
		}

		// 3. Otherwise: Admins and Volunteers see everything in admin/moderation tabs
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
				),
				eligible_branches:announcement_eligible_branches(
					branch:branches(
						id,
						name,
						code
					)
				),
				eligible_batches:announcement_eligible_batches(
					batch:batches(
						id,
						year
					)
				)
				`,
				{ count: "exact" },
			)
			.order("is_pinned", { ascending: false })
			.order("announcement_priority", { ascending: false })
			.order("created_at", { ascending: false });

		query = query.eq("is_active", true);

		const { data, error, count } = await query.range(from, to);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
			throw error;
		}

		const formattedData = data?.map(ann => this.formatAnnouncement(ann)) ?? [];
		const total = count ?? 0;
		const totalPages = Math.ceil(total / limitNum);

		return { announcements: formattedData, total, page: pageNum, limit: limitNum, totalPages };
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
					),
					eligible_branches:announcement_eligible_branches(
						branch:branches(
							id,
							name,
							code
						)
					),
					eligible_batches:announcement_eligible_batches(
						batch:batches(
							id,
							year
						)
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

		return this.formatAnnouncement(data);
	}

	async updateAnnouncement(announcementId, updates, branchIds, batchIds) {
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

		// Handle eligible branches update if standalone
		if (!data.job_id && branchIds !== undefined) {
			const { error: deleteError } = await supabase.schema("placement").from("announcement_eligible_branches").delete().eq("announcement_id", announcementId);
			if (deleteError) {
				const mapped = mapSupabaseError(deleteError);
				if (mapped) throw mapped;
				throw deleteError;
			}

			if (branchIds && branchIds.length > 0) {
				const branchRows = branchIds.map(branchId => ({ announcement_id: announcementId, branch_id: branchId }));
				const { error: insertError } = await supabase.schema("placement").from("announcement_eligible_branches").insert(branchRows);
				if (insertError) {
					const mapped = mapSupabaseError(insertError);
					if (mapped) throw mapped;
					throw insertError;
				}
			}
		}

		// Handle eligible batches update if standalone
		if (!data.job_id && batchIds !== undefined) {
			const { error: deleteError } = await supabase.schema("placement").from("announcement_eligible_batches").delete().eq("announcement_id", announcementId);
			if (deleteError) {
				const mapped = mapSupabaseError(deleteError);
				if (mapped) throw mapped;
				throw deleteError;
			}

			if (batchIds && batchIds.length > 0) {
				const batchRows = batchIds.map(batchId => ({ announcement_id: announcementId, batch_id: batchId }));
				const { error: insertError } = await supabase.schema("placement").from("announcement_eligible_batches").insert(batchRows);
				if (insertError) {
					const mapped = mapSupabaseError(insertError);
					if (mapped) throw mapped;
					throw insertError;
				}
			}
		}

		return this.getAnnouncementById(announcementId);
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
