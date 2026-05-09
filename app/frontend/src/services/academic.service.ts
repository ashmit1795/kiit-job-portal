import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Program, Branch, Batch } from "@/types/academic";

export const academicService = {
  fetchPrograms: async () => {
    const { data } = await api.get<ApiResponse<Program[]>>("/academics/programs");
    return data.data || [];
  },

  fetchBranches: async (programId?: string) => {
    const url = programId ? `/academics/branches?program_id=${programId}` : "/academics/branches";
    const { data } = await api.get<ApiResponse<Branch[]>>(url);
    return data.data || [];
  },

  fetchBatches: async () => {
    const { data } = await api.get<ApiResponse<Batch[]>>("/academics/batches");
    return data.data || [];
  },
};
