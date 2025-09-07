import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: "http://localhost:8080", // ✅ your backend base URL
});

// 🔑 Attach Bearer token for every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // get token from store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
