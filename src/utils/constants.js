/**
 * Constants for Productivity Symphony
 */

export const STORAGE_KEYS = {
  PROJECTS: 'productivity_symphony_projects_v3',
  IDEAS: 'productivity_symphony_ideas_v3',
  PORTFOLIOS: 'productivity_symphony_portfolios',
  COMMENTS: 'productivity_symphony_comments',
  AI_MESSAGES: 'productivity_symphony_ai_messages',
};

export const categories = [
  'Production',
  'Distribution',
  'ESG',
  'Technology',
  'Healthcare',
  'Operations',
  'CapEx',
  'Customer'
];

export const projectManagers = [
  'Sarah Chen',
  'Michael Ross',
  'Emily Watson',
  'David Kim',
  'Lisa Park',
  'James Miller',
  'Nina Patel',
  'Robert Chen',
  'Amanda Foster',
  'Thomas Wright'
];

export const PROJECT_STATUSES = [
  'Creation',
  'Feasibility Assessment',
  'Commitment',
  'Execution',
  'Benefit Tracking'
];

export const FINANCE_APPROVAL_STATUSES = [
  'Pending',
  'Approved',
  'Rejected',
  'On Hold'
];

export const IDEA_STATUSES = [
  'Under Review',
  'Approved',
  'Converting'
];

export const RISK_LEVELS = ['low', 'medium', 'high'];

export const HEALTH_STATUSES = ['green', 'yellow', 'red'];

/**
 * Prioritization criteria for ideas
 */
export const PRIORITIZATION_CRITERIA = {
  strategicAlignment: { label: 'Strategic Alignment', weight: 0.25, max: 10 },
  financialImpact: { label: 'Financial Impact', weight: 0.25, max: 10 },
  feasibility: { label: 'Feasibility', weight: 0.20, max: 10 },
  timeToValue: { label: 'Time to Value', weight: 0.15, max: 10 },
  riskLevel: { label: 'Risk Level (inverse)', weight: 0.15, max: 10 },
};

/**
 * Initial project data
 */
export const initialProjectsData = [
  { id: 1, name: 'Air Separation Unit (ASU) Efficiency Upgrade', projectStatus: 'Execution', financeApproval: 'Approved', health: 'green', pm: 'Sarah Chen', category: 'Production', benefitProjection: 4500000, actualBenefit: 3200000, progress: 72, risk: 'low', portfolioId: 1, comments: [] },
  { id: 2, name: 'Hydrogen Production Plant Expansion', projectStatus: 'Feasibility Assessment', financeApproval: 'Pending', health: 'yellow', pm: 'Michael Ross', category: 'CapEx', benefitProjection: 12000000, actualBenefit: 1500000, progress: 25, risk: 'medium', portfolioId: 1, comments: [] },
  { id: 3, name: 'CO2 Capture & Sequestration Initiative', projectStatus: 'Commitment', financeApproval: 'Approved', health: 'green', pm: 'Emily Watson', category: 'ESG', benefitProjection: 8500000, actualBenefit: 2100000, progress: 40, risk: 'low', portfolioId: 2, comments: [] },
  { id: 4, name: 'Cryogenic Tank Fleet Modernization', projectStatus: 'Execution', financeApproval: 'Approved', health: 'green', pm: 'David Kim', category: 'Distribution', benefitProjection: 3200000, actualBenefit: 2400000, progress: 78, risk: 'low', portfolioId: 1, comments: [] },
  { id: 5, name: 'Smart Cylinder Tracking System (IoT)', projectStatus: 'Benefit Tracking', financeApproval: 'Approved', health: 'green', pm: 'Lisa Park', category: 'Technology', benefitProjection: 1800000, actualBenefit: 1500000, progress: 85, risk: 'low', portfolioId: 2, comments: [] },
  { id: 6, name: 'Nitrogen Generator On-Site Deployment', projectStatus: 'Feasibility Assessment', financeApproval: 'On Hold', health: 'yellow', pm: 'James Miller', category: 'Customer', benefitProjection: 2400000, actualBenefit: 400000, progress: 30, risk: 'high', portfolioId: 1, comments: [] },
];

/**
 * Initial ideas data
 */
export const initialIdeasData = [
  { id: 1, title: 'Ammonia Cracking for Blue Hydrogen', description: 'Explore ammonia cracking technology', submitter: 'John Miller', votes: 38, status: 'Under Review', category: 'Production', portfolioId: 1, scores: { strategicAlignment: 8, financialImpact: 7, feasibility: 6, timeToValue: 5, riskLevel: 7 }, comments: [] },
  { id: 2, title: 'Predictive Maintenance for Compressors', description: 'AI-driven predictive maintenance', submitter: 'Amy Liu', votes: 45, status: 'Approved', category: 'Operations', portfolioId: 1, scores: { strategicAlignment: 9, financialImpact: 8, feasibility: 8, timeToValue: 7, riskLevel: 8 }, comments: [] },
  { id: 3, title: 'Carbon Footprint Dashboard for Customers', description: 'Real-time emissions tracking', submitter: 'Robert Chen', votes: 31, status: 'Under Review', category: 'ESG', portfolioId: 2, scores: { strategicAlignment: 7, financialImpact: 6, feasibility: 7, timeToValue: 6, riskLevel: 8 }, comments: [] },
  { id: 4, title: 'Specialty Gas Mixing Automation', description: 'Automated gas mixing', submitter: 'Nina Patel', votes: 52, status: 'Converting', category: 'Production', portfolioId: 1, scores: { strategicAlignment: 8, financialImpact: 8, feasibility: 7, timeToValue: 7, riskLevel: 7 }, comments: [] },
];

/**
 * Initial portfolios data
 */
export const initialPortfolios = [
  { id: 1, name: 'Strategic Initiatives 2025', owner: 'Sarah Chen', description: 'High-impact strategic projects', color: '#0ea5e9' },
  { id: 2, name: 'ESG & Sustainability', owner: 'Emily Watson', description: 'Environmental and sustainability projects', color: '#8b5cf6' },
  { id: 3, name: 'Operational Excellence', owner: 'David Kim', description: 'Efficiency and operational improvements', color: '#10b981' },
];
