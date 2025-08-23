// utils/getImageUrl.js
const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (path) => {
  if (!path) return "/images/profile.png"; // fallback default
  return path.startsWith("http") ? path : `${API_URL}/uploads/${path}`;
};
