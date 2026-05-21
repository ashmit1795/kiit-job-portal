import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export interface CompleteProfilePayload {
  branch_id: string;
  batch_id: string;
  cgpa: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  subscribe_to_alerts?: boolean;
}

export interface UpdateProfilePayload {
  branch_id?: string;
  batch_id?: string;
  cgpa?: number;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  personal_email?: string | null;
  phone_number?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
}

export interface NotificationPrefs {
  user_id: string;
  email_alerts: boolean;
  telegram_alerts: boolean;
  created_at: string;
}

export const profileService = {
  completeProfile: async (payload: CompleteProfilePayload) => {
    const { data } = await api.post<ApiResponse<User>>("/profile/complete", payload);
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await api.patch<ApiResponse<User>>("/profile/update", payload);
    return data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    const { data } = await api.post<ApiResponse<User>>("/profile/resume", formData);
    return data;
  },

  getResumeUrl: async () => {
    const { data } = await api.get<ApiResponse<{ url: string }>>("/profile/resume");
    return data.data?.url || null;
  },

  getNotificationPrefs: async () => {
    const { data } = await api.get<ApiResponse<NotificationPrefs>>("/profile/notifications");
    return data.data;
  },

  updateNotificationPrefs: async (prefs: { email_alerts: boolean }) => {
    const { data } = await api.patch<ApiResponse<NotificationPrefs>>("/profile/notifications", prefs);
    return data.data;
  },
};
