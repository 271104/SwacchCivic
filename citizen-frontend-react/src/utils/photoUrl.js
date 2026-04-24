// utils/photoUrl.js

/**
 * Get the base URL for the API (without /api suffix)
 * This extracts the base URL from the API URL environment variable
 */
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://swacchcivic.onrender.com/api';
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Generate a full photo URL from a photo path
 * @param {string} photoPath - The photo path from the backend (e.g., "uploads/complaints/complaint-123.jpg")
 * @returns {string} - Full URL to the photo
 */
export const getPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  
  const baseUrl = getBaseUrl();
  // Normalize path separators (Windows backslashes to forward slashes)
  const normalizedPath = photoPath.replace(/\\/g, '/');
  
  return `${baseUrl}/${normalizedPath}`;
};
