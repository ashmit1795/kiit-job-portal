import api from "@/lib/api";

export const contactService = {
  sendMessage: async (data: { name: string; email: string; message: string }) => {
    const response = await api.post("/contact", data);
    return response.data;
  },
};
