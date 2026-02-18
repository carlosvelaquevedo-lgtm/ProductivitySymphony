/**
 * Calculation utilities for Productivity Symphony
 */

import { PRIORITIZATION_CRITERIA } from './constants';

/**
 * Calculate priority score for an idea based on weighted criteria
 * @param {Object} scores - Object containing scores for each criterion
 * @returns {number} Priority score (0-100)
 */
export const calculatePriorityScore = (scores) => {
  if (!scores) return 0;

  let total = 0;
  Object.keys(PRIORITIZATION_CRITERIA).forEach(key => {
    const criterion = PRIORITIZATION_CRITERIA[key];
    const score = scores[key] || 0;
    total += (score / criterion.max) * criterion.weight * 100;
  });

  return Math.round(total);
};

/**
 * Generate yearly benefits data for charts
 * @param {number} year - The year to generate data for
 * @returns {Array} Array of monthly benefit data
 */
export const generateYearlyData = (year) => {
  const multiplier = year === 2024 ? 1 : year === 2025 ? 1.15 : 1.32;
  const benefitsData = [
    { month: 'Jan', forecast: 3800, actual: 3650 },
    { month: 'Feb', forecast: 4100, actual: 4200 },
    { month: 'Mar', forecast: 4400, actual: 4550 },
    { month: 'Apr', forecast: 4700, actual: 4800 },
    { month: 'May', forecast: 5000, actual: 5150 },
    { month: 'Jun', forecast: 5300, actual: 5400 },
    { month: 'Jul', forecast: 5600, actual: 5750 },
    { month: 'Aug', forecast: 5900, actual: 6100 },
    { month: 'Sep', forecast: 6200, actual: 6350 },
    { month: 'Oct', forecast: 6500, actual: 6700 },
    { month: 'Nov', forecast: 6800, actual: 7000 },
    { month: 'Dec', forecast: 7100, actual: 7350 },
  ];

  return benefitsData.map(d => ({
    ...d,
    forecast: Math.round(d.forecast * multiplier),
    actual: year <= 2025 ? Math.round(d.actual * multiplier) : 0
  }));
};

/**
 * Calculate progress percentage
 * @param {number} actual - Actual benefit amount
 * @param {number} projection - Projected benefit amount
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressPercentage = (actual, projection) => {
  if (!projection || projection === 0) return 0;
  return Math.min(100, Math.round((actual / projection) * 100));
};

/**
 * Calculate ROI (Return on Investment)
 * @param {number} benefit - Benefit amount
 * @param {number} cost - Cost amount
 * @returns {number} ROI percentage
 */
export const calculateROI = (benefit, cost) => {
  if (!cost || cost === 0) return 0;
  return ((benefit - cost) / cost) * 100;
};
