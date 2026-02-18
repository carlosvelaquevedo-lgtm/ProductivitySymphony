/**
 * LocalStorage utilities for Productivity Symphony
 */

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed data from storage or default value
 */
export const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    // Check if quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider implementing data cleanup.');
    }
    return false;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key to remove
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 * @param {string[]} keys - Array of storage keys to clear
 * @returns {boolean} Success status
 */
export const clearStorage = (keys) => {
  try {
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
