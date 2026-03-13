import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Job } from "@/types/job";

export interface CreateJobPayload {
  circular_number: string;
  company_name: string;
  role_title: string;
  job_type: string;
  ctc?: string;
  stipend?: string;
  min_cgpa?: number;
  deadline: string;
  joining_date?: string;
  description?: string;
  apply_link_1?: string;
  apply_link_2?: string;
  branches: string[];
  batches: string[];
  locations: string[];
  circular_file: File;
}

export const jobService = {
  fetchJobs: async () => {
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs");
    return data.data || [];
  },

  fetchJobFeed: async () => {
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs/feed");
    return data.data || [];
  },

  fetchJobById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return data.data || null;
  },

  downloadCircular: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ url: string }>>(`/jobs/${id}/circular`);
    return data.data?.url || null;
  },

  createJob: async (payload: CreateJobPayload) => {
    console.log("[createJob] START - building FormData");
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "circular_file") {
          formData.append("circular", value as File);
          console.log("[createJob] appended circular file:", (value as File).name);
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
          console.log(`[createJob] appended array ${key}[]:`, value.length, "items");
        } else {
          formData.append(key, value.toString());
          console.log(`[createJob] appended ${key}:`, value.toString().substring(0, 50));
        }
      }
    });

    console.log("[createJob] FormData built. Sending POST /jobs ...");
    try {
      const { data } = await api.post<ApiResponse<{ id: string }>>("/jobs", formData);
      console.log("[createJob] SUCCESS:", data);
      return data.data;
    } catch (err) {
      console.error("[createJob] ERROR:", err);
      throw err;
    }
  },

  approveJob: async (id: string) => {
    const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}/approve`);
    return data.data;
  },

  rejectJob: async (id: string) => {
    const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}/reject`);
    return data.data;
  },
};
