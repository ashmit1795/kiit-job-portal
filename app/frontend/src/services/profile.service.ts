import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export interface CompleteProfilePayload {
  branch_id: string;
  batch_id: string;
  cgpa: number;
  tenth_percentage: number;
  twelfth_percentage: number;
}

export interface UpdateProfilePayload {
  branch_id?: string;
  batch_id?: string;
  cgpa?: number;
  tenth_percentage?: number;
  twelfth_percentage?: number;
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
    const { data } = await api.post<ApiResponse<User>>("/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getResumeUrl: async () => {
    const { data } = await api.get<ApiResponse<{ url: string }>>("/profile/resume");
    return data.data?.url || null;
  },
};
