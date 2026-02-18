/**
 * Form validation utilities for Productivity Symphony
 */

/**
 * Validate project form data
 * @param {Object} data - Project form data
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateProject = (data) => {
  const errors = {};

  // Required fields
  if (!data.name || !data.name.trim()) {
    errors.name = 'Project name is required';
  } else if (data.name.length > 200) {
    errors.name = 'Project name must be 200 characters or less';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.pm) {
    errors.pm = 'Project manager is required';
  }

  // Benefit validation
  if (!data.benefitProjection) {
    errors.benefitProjection = 'Benefit projection is required';
  } else {
    const benefit = Number(data.benefitProjection);
    if (isNaN(benefit)) {
      errors.benefitProjection = 'Benefit projection must be a number';
    } else if (benefit < 0) {
      errors.benefitProjection = 'Benefit projection cannot be negative';
    } else if (benefit > 1000000000) { // 1 billion max
      errors.benefitProjection = 'Benefit projection is too large';
    }
  }

  // Progress validation
  if (data.progress !== undefined && data.progress !== null) {
    const progress = Number(data.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      errors.progress = 'Progress must be between 0 and 100';
    }
  }

  // Actual benefit validation
  if (data.actualBenefit !== undefined && data.actualBenefit !== null) {
    const actual = Number(data.actualBenefit);
    if (isNaN(actual)) {
      errors.actualBenefit = 'Actual benefit must be a number';
    } else if (actual < 0) {
      errors.actualBenefit = 'Actual benefit cannot be negative';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate idea form data
 * @param {Object} data - Idea form data
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateIdea = (data) => {
  const errors = {};

  // Required fields
  if (!data.title || !data.title.trim()) {
    errors.title = 'Idea title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }

  if (!data.submitter || !data.submitter.trim()) {
    errors.submitter = 'Submitter name is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Validate scores
  if (data.scores) {
    const scoreFields = ['strategicAlignment', 'financialImpact', 'feasibility', 'timeToValue', 'riskLevel'];
    scoreFields.forEach(field => {
      if (data.scores[field] !== undefined) {
        const score = Number(data.scores[field]);
        if (isNaN(score) || score < 0 || score > 10) {
          errors[field] = `${field} score must be between 0 and 10`;
        }
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate portfolio form data
 * @param {Object} data - Portfolio form data
 * @returns {Object} Validation result { isValid, errors }
 */
export const validatePortfolio = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Portfolio name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Portfolio name must be 100 characters or less';
  }

  if (!data.owner || !data.owner.trim()) {
    errors.owner = 'Portfolio owner is required';
  }

  if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.color = 'Invalid color format. Use hex format (#RRGGBB)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize string input (prevent XSS)
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
