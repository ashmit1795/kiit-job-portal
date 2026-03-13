import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Cache the access token so we never call getSession() concurrently.
// onAuthStateChange fires on login, logout, and token refresh — keeping the
// cached value always up-to-date without blocking the request pipeline.
let cachedAccessToken: string | null = null;

// Seed the token on first load
supabase.auth.getSession().then(({ data: { session } }) => {
  cachedAccessToken = session?.access_token ?? null;
});

// Keep token in sync with auth state changes (refresh, sign-in, sign-out)
supabase.auth.onAuthStateChange((_event, session) => {
  cachedAccessToken = session?.access_token ?? null;
});

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
      supabase.auth.signOut();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Dynamic import to avoid circular deps — toast fires before redirect
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
