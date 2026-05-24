import axios from "axios";

const api = axios.create({
  // In local development, Vite proxies /api to the backend to avoid browser CORS issues.
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while talking to the server.";

    return Promise.reject({
      ...error,
      friendlyMessage: message,
      status: error?.response?.status,
    });
  }
);

export default api;
