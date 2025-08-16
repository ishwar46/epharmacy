/**
 * Utility functions for handling image URLs and paths
 */

// Get the backend base URL from environment variables
const getBackendBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';
};

/**
 * Constructs the full image URL from a relative path or filename
 * @param {string} imagePath - The image path (could be relative or just filename)
 * @returns {string} - Full URL to the image
 */
export const getImageURL = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a data URL (base64), return as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  const baseURL = getBackendBaseURL();

  // If the path starts with a slash, use it directly
  if (imagePath.startsWith('/')) {
    return `${baseURL}${imagePath}`;
  }

  // If it's just a filename or relative path, assume it's in uploads folder
  // Handle both cases: filename only or uploads/userProfiles/filename
  if (imagePath.includes('uploads/')) {
    return `${baseURL}/${imagePath}`;
  } else {
    // Assume it's just a filename and should be in userProfiles folder
    return `${baseURL}/uploads/userProfiles/${imagePath}`;
  }
};

/**
 * Constructs profile picture URL specifically
 * @param {string} profilePicture - The profile picture path from user data
 * @returns {string|null} - Full URL to the profile picture or null
 */
export const getProfilePictureURL = (profilePicture) => {
  return getImageURL(profilePicture);
};

/**
 * Gets a fallback/default profile picture URL
 * @returns {string} - URL to default profile picture
 */
export const getDefaultProfilePicture = () => {
  // You can return a default avatar image URL or null to show initials
  return null;
};

/**
 * Validates if an image URL is accessible
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const validateImageURL = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

export default {
  getImageURL,
  getProfilePictureURL,
  getDefaultProfilePicture,
  validateImageURL
};