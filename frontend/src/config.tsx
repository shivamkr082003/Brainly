export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL?.replace(/\/#\/?$/, '') ||
  window.location.origin;
