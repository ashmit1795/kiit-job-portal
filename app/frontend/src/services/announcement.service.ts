import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Announcement, PaginatedAnnouncements, CreateAnnouncementPayload, UpdateAnnouncementPayload } from "@/types/announcement";

export interface AnnouncementsQuery {
  job_id?: string;
  page?: number;
  limit?: number;
}

export const announcementService = {
  fetchAnnouncements: async (params: AnnouncementsQuery = {}): Promise<PaginatedAnnouncements> => {
    const { data } = await api.get<ApiResponse<{ announcements: Announcement[] }>>(
      "/announcements",
      { params }
    );
    return {
      announcements: data.data?.announcements || [],
      meta: {
        page: data.meta?.page || 1,
        limit: data.meta?.limit || 20,
        total: data.meta?.total || 0,
        totalPages: data.meta?.totalPages || 1,
      },
    };
  },

  fetchAnnouncementById: async (id: string): Promise<Announcement | null> => {
    const { data } = await api.get<ApiResponse<Announcement>>(`/announcements/${id}`);
    return data.data || null;
  },

  downloadCircular: async (id: string): Promise<string | null> => {
    const { data } = await api.get<ApiResponse<{ url: string }>>(`/announcements/${id}/circular`);
    return data.data?.url || null;
  },

  createAnnouncement: async (payload: CreateAnnouncementPayload): Promise<{ id: string }> => {
    const formData = new FormData();
    formData.append("subject", payload.subject);
    formData.append("description", payload.description);
    if (payload.job_id) formData.append("job_id", payload.job_id);
    if (payload.announcement_type) formData.append("announcement_type", payload.announcement_type);
    formData.append("is_pinned", String(payload.is_pinned ?? false));
    if (payload.circular) formData.append("circular", payload.circular);
    if (payload.circular_number) formData.append("circular_number", payload.circular_number);

    const { data } = await api.post<ApiResponse<{ id: string }>>("/announcements", formData);
    return data.data!;
  },

  updateAnnouncement: async (id: string, payload: UpdateAnnouncementPayload): Promise<Announcement> => {
    const formData = new FormData();
    if (payload.subject !== undefined) formData.append("subject", payload.subject);
    if (payload.description !== undefined) formData.append("description", payload.description);
    if (payload.announcement_type !== undefined) formData.append("announcement_type", payload.announcement_type);
    if (payload.is_pinned !== undefined) formData.append("is_pinned", String(payload.is_pinned));
    if (payload.announcement_priority !== undefined) formData.append("announcement_priority", String(payload.announcement_priority));
    if (payload.job_id !== undefined) formData.append("job_id", payload.job_id ?? "");
    if (payload.circular) formData.append("circular", payload.circular);
    if (payload.circular_number !== undefined) formData.append("circular_number", payload.circular_number ?? "");

    const { data } = await api.patch<ApiResponse<Announcement>>(`/announcements/${id}`, formData);
    return data.data!;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },
};
