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
  created_at?: string;
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
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "circular_file") {
          formData.append("circular", value as File);
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const { data } = await api.post<ApiResponse<{ id: string }>>("/jobs", formData);
    return data.data;
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
