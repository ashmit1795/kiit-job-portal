import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  AdminStats,
  AdminLog,
  AdminUser,
  AdminJob,
  UserJobsResponse,
  PaginatedUsers,
  PaginatedJobs,
  PaginatedLogs,
} from "@/types/admin";

export const adminService = {
  // ── Dashboard ────────────────────────────────────────────
  fetchDashboardStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<ApiResponse<AdminStats>>("/admin/dashboard");
    return data.data!;
  },

  // ── Users ────────────────────────────────────────────────
  fetchUsers: async (params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<PaginatedUsers> => {
    const { data } = await api.get<ApiResponse<PaginatedUsers>>("/admin/users", { params });
    return data.data!;
  },

  fetchUserById: async (id: string): Promise<AdminUser> => {
    const { data } = await api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`);
    return data.data!;
  },

  fetchUserJobs: async (userId: string): Promise<UserJobsResponse> => {
    const { data } = await api.get<ApiResponse<UserJobsResponse>>(`/admin/users/${userId}/jobs`);
    return data.data!;
  },

  updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
    const { data } = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/role`, { role });
    return data.data!;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  // ── Jobs ─────────────────────────────────────────────────
  fetchAllJobs: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<PaginatedJobs> => {
    const { data } = await api.get<ApiResponse<PaginatedJobs>>("/admin/jobs", { params });
    return data.data!;
  },

  // ── Logs ─────────────────────────────────────────────────
  fetchLogs: async (params: {
    page?: number;
    limit?: number;
    action?: string;
  }): Promise<PaginatedLogs> => {
    const { data } = await api.get<ApiResponse<PaginatedLogs>>("/admin/logs", { params });
    return data.data!;
  },

  // ── Academics ────────────────────────────────────────────
  deleteProgram: async (id: string): Promise<void> => {
    await api.delete(`/academics/programs/${id}`);
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/academics/branches/${id}`);
  },

  deleteBatch: async (id: string): Promise<void> => {
    await api.delete(`/academics/batches/${id}`);
  },
};
