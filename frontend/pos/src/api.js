import axios from "axios";

const api = axios.create({
  // VITE_API_URL is set in Vercel. The fallback keeps local development working.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export default api;
