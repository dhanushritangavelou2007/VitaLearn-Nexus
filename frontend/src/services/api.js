import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://vitalearn-nexus-backend.vercel.app",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const session = JSON.parse(window.localStorage.getItem("vitalearn.auth.session") || "null");
  const token = session?.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
