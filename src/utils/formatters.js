/**
 * Formatting utilities for Productivity Symphony
 */

/**
 * Format number as currency with abbreviations
 * @param {number} n - The number to format
 * @returns {string} Formatted currency string (e.g., "$5.2M")
 */
export const fmt = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

/**
 * Format number as full currency
 * @param {number} num - The number to format
 * @returns {string} Formatted currency string (e.g., "$1,234,567")
 */
export const fmtFull = (num) => `$${num.toLocaleString()}`;

/**
 * Format date as readable string
 * @param {number|Date} timestamp - Timestamp or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};
