import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Token cache — set by AuthProvider via setAccessToken(), no duplicate listeners
let cachedAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  cachedAccessToken = token;
}

api.interceptors.request.use((config) => {
  if (cachedAccessToken) {
    config.headers.Authorization = `Bearer ${cachedAccessToken}`;
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cachedAccessToken = null;
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        import("sonner").then(({ toast }) => {
          toast.error("Session expired, please sign in again.");
        });
        setTimeout(() => { window.location.href = "/login"; }, 500);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
