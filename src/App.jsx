import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Line, ComposedChart } from 'recharts';
import { Search, Plus, ChevronRight, Filter, Bell, Settings, FolderKanban, Lightbulb, TrendingUp, Users, DollarSign, Target, ArrowLeft, ArrowRight, MoreHorizontal, X, Sparkles, Activity, BarChart3, Circle, Send, Cpu, ChevronUp, ChevronDown, Database, Hash, Star, Award, Zap, CheckCircle, Clock, MessageSquare, Folder, SlidersHorizontal, ArrowUpDown, Download, FileDown, FileText, Bot, Calendar, TrendingDown } from 'lucide-react';

// ============================================================================
// CONSTANTS & INITIAL DATA
// ============================================================================

const STORAGE_KEYS = {
  PROJECTS: 'productivity_symphony_projects_v3',
  IDEAS: 'productivity_symphony_ideas_v3',
  PORTFOLIOS: 'productivity_symphony_portfolios',
  COMMENTS: 'productivity_symphony_comments',
  AI_MESSAGES: 'productivity_symphony_ai_messages',
};

const categories = ['Production', 'Distribution', 'ESG', 'Technology', 'Healthcare', 'Operations', 'CapEx', 'Customer'];
const projectManagers = ['Sarah Chen', 'Michael Ross', 'Emily Watson', 'David Kim', 'Lisa Park', 'James Miller', 'Nina Patel', 'Robert Chen', 'Amanda Foster', 'Thomas Wright'];

// NEW: Project Status workflow
const PROJECT_STATUSES = ['Creation', 'Feasibility Assessment', 'Commitment', 'Execution', 'Benefit Tracking'];
const FINANCE_APPROVAL_STATUSES = ['Pending', 'Approved', 'Rejected', 'On Hold'];

// Prioritization criteria
const PRIORITIZATION_CRITERIA = {
  strategicAlignment: { label: 'Strategic Alignment', weight: 0.25, max: 10 },
  financialImpact: { label: 'Financial Impact', weight: 0.25, max: 10 },
  feasibility: { label: 'Feasibility', weight: 0.20, max: 10 },
  timeToValue: { label: 'Time to Value', weight: 0.15, max: 10 },
  riskLevel: { label: 'Risk Level (inverse)', weight: 0.15, max: 10 },
};

// Enhanced initial data with new fields
const initialProjectsData = [
  { id: 1, name: 'Air Separation Unit (ASU) Efficiency Upgrade', projectStatus: 'Execution', financeApproval: 'Approved', health: 'green', pm: 'Sarah Chen', category: 'Production', benefitProjection: 4500000, actualBenefit: 3200000, progress: 72, risk: 'low', portfolioId: 1, comments: [] },
  { id: 2, name: 'Hydrogen Production Plant Expansion', projectStatus: 'Feasibility Assessment', financeApproval: 'Pending', health: 'yellow', pm: 'Michael Ross', category: 'CapEx', benefitProjection: 12000000, actualBenefit: 1500000, progress: 25, risk: 'medium', portfolioId: 1, comments: [] },
  { id: 3, name: 'CO2 Capture & Sequestration Initiative', projectStatus: 'Commitment', financeApproval: 'Approved', health: 'green', pm: 'Emily Watson', category: 'ESG', benefitProjection: 8500000, actualBenefit: 2100000, progress: 40, risk: 'low', portfolioId: 2, comments: [] },
  { id: 4, name: 'Cryogenic Tank Fleet Modernization', projectStatus: 'Execution', financeApproval: 'Approved', health: 'green', pm: 'David Kim', category: 'Distribution', benefitProjection: 3200000, actualBenefit: 2400000, progress: 78, risk: 'low', portfolioId: 1, comments: [] },
  { id: 5, name: 'Smart Cylinder Tracking System (IoT)', projectStatus: 'Benefit Tracking', financeApproval: 'Approved', health: 'green', pm: 'Lisa Park', category: 'Technology', benefitProjection: 1800000, actualBenefit: 1500000, progress: 85, risk: 'low', portfolioId: 2, comments: [] },
  { id: 6, name: 'Nitrogen Generator On-Site Deployment', projectStatus: 'Feasibility Assessment', financeApproval: 'On Hold', health: 'yellow', pm: 'James Miller', category: 'Customer', benefitProjection: 2400000, actualBenefit: 400000, progress: 30, risk: 'high', portfolioId: 1, comments: [] },
];

const initialIdeasData = [
  { id: 1, title: 'Ammonia Cracking for Blue Hydrogen', description: 'Explore ammonia cracking technology', submitter: 'John Miller', votes: 38, status: 'Under Review', category: 'Production', portfolioId: 1, scores: { strategicAlignment: 8, financialImpact: 7, feasibility: 6, timeToValue: 5, riskLevel: 7 }, comments: [] },
  { id: 2, title: 'Predictive Maintenance for Compressors', description: 'AI-driven predictive maintenance', submitter: 'Amy Liu', votes: 45, status: 'Approved', category: 'Operations', portfolioId: 1, scores: { strategicAlignment: 9, financialImpact: 8, feasibility: 8, timeToValue: 7, riskLevel: 8 }, comments: [] },
  { id: 3, title: 'Carbon Footprint Dashboard for Customers', description: 'Real-time emissions tracking', submitter: 'Robert Chen', votes: 31, status: 'Under Review', category: 'ESG', portfolioId: 2, scores: { strategicAlignment: 7, financialImpact: 6, feasibility: 7, timeToValue: 6, riskLevel: 8 }, comments: [] },
  { id: 4, title: 'Specialty Gas Mixing Automation', description: 'Automated gas mixing', submitter: 'Nina Patel', votes: 52, status: 'Converting', category: 'Production', portfolioId: 1, scores: { strategicAlignment: 8, financialImpact: 8, feasibility: 7, timeToValue: 7, riskLevel: 7 }, comments: [] },
];

const initialPortfolios = [
  { id: 1, name: 'Strategic Initiatives 2025', owner: 'Sarah Chen', description: 'High-impact strategic projects', color: '#0ea5e9' },
  { id: 2, name: 'ESG & Sustainability', owner: 'Emily Watson', description: 'Environmental and sustainability projects', color: '#8b5cf6' },
  { id: 3, name: 'Operational Excellence', owner: 'David Kim', description: 'Efficiency and operational improvements', color: '#10b981' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n}`;
const fmtFull = (num) => `$${num.toLocaleString()}`;

const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

const calculatePriorityScore = (scores) => {
  if (!scores) return 0;
  let total = 0;
  Object.keys(PRIORITIZATION_CRITERIA).forEach(key => {
    const criterion = PRIORITIZATION_CRITERIA[key];
    const score = scores[key] || 0;
    total += (score / criterion.max) * criterion.weight * 100;
  });
  return Math.round(total);
};

// Enhanced CSV Export Utility
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      if (val === null || val === undefined) return '';
      return val;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Generate yearly benefits data for charts
const generateYearlyData = (year) => {
  const multiplier = year === 2024 ? 1 : year === 2025 ? 1.15 : 1.32;
  const benefitsData = [
    { month: 'Jan', forecast: 3800, actual: 3650 }, { month: 'Feb', forecast: 4100, actual: 4200 },
    { month: 'Mar', forecast: 4400, actual: 4550 }, { month: 'Apr', forecast: 4700, actual: 4800 },
    { month: 'May', forecast: 5000, actual: 5150 }, { month: 'Jun', forecast: 5300, actual: 5400 },
    { month: 'Jul', forecast: 5600, actual: 5750 }, { month: 'Aug', forecast: 5900, actual: 6100 },
    { month: 'Sep', forecast: 6200, actual: 6350 }, { month: 'Oct', forecast: 6500, actual: 6700 },
    { month: 'Nov', forecast: 6800, actual: 7000 }, { month: 'Dec', forecast: 7100, actual: 7350 },
  ];
  return benefitsData.map(d => ({
    ...d,
    forecast: Math.round(d.forecast * multiplier),
    actual: year <= 2025 ? Math.round(d.actual * multiplier) : 0
  }));
};

// CSV Download Utility (legacy - keeping for compatibility)
const downloadCSV = (filename, headers, data) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => {
      const cellStr = String(cell);
      return cellStr.includes(',') || cellStr.includes('"') ? `"${cellStr.replace(/"/g, '""')}"` : cellStr;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const HealthDot = ({ health }) => {
  const colors = { green: 'bg-emerald-500 ring-emerald-200', yellow: 'bg-amber-500 ring-amber-200', red: 'bg-red-500 ring-red-200' };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[health]} ring-4`} />;
};

const StatusPill = ({ status, type = 'idea' }) => {
  const ideaStyles = {
    'Under Review': 'bg-violet-50 text-violet-700 border-violet-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Converting': 'bg-sky-50 text-sky-700 border-sky-200',
  };
  
  const projectStyles = {
    'Creation': 'bg-slate-100 text-slate-700 border-slate-300',
    'Feasibility Assessment': 'bg-blue-50 text-blue-700 border-blue-200',
    'Commitment': 'bg-violet-50 text-violet-700 border-violet-200',
    'Execution': 'bg-sky-50 text-sky-700 border-sky-200',
    'Benefit Tracking': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  
  const financeStyles = {
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-red-50 text-red-700 border-red-200',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-300',
  };
  
  const styles = type === 'idea' ? ideaStyles : type === 'finance' ? financeStyles : projectStyles;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>{status}</span>;
};

const NavItem = ({ icon: Icon, label, view, badge, activeView, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeView === view ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
    <Icon size={18} strokeWidth={1.5} />
    <span className="font-medium text-sm flex-1 text-left">{label}</span>
    {badge && <span className="px-1.5 py-0.5 text-xs bg-sky-500 text-white rounded-full">{badge}</span>}
  </button>
);

const StatCard = ({ icon: Icon, label, value, change, up, sub }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-slate-100 rounded-lg"><Icon size={20} className="text-slate-600" /></div>
      {change && <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}{change}</span>}
    </div>
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ============================================================================
// FILTER & SORT CONTROLS COMPONENT
// ============================================================================

const FilterSortControls = ({ 
  onFilterChange, 
  onSortChange, 
  filters, 
  sortBy, 
  sortDirection,
  availableCategories,
  availableStatuses,
  showPortfolio = false,
  portfolios = [],
  type = 'project' // 'project' or 'idea'
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal size={16} />
        Filters & Sorting
      </div>
      
      <div className="grid md:grid-cols-4 gap-3">
        {/* Category Filter */}
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value === 'all' ? null : e.target.value })}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All Categories</option>
          {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value === 'all' ? null : e.target.value })}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All Statuses</option>
          {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
        </select>

        {/* Portfolio Filter */}
        {showPortfolio && (
          <select
            value={filters.portfolioId || 'all'}
            onChange={(e) => onFilterChange({ ...filters, portfolioId: e.target.value === 'all' ? null : parseInt(e.target.value) })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Portfolios</option>
            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}

        {/* Sort By */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortDirection)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            {type === 'project' && <option value="benefitProjection">Benefit $</option>}
            {type === 'project' && <option value="progress">Progress</option>}
            {type === 'project' && <option value="projectStatus">Status</option>}
            {type === 'project' && <option value="financeApproval">Finance</option>}
            {type === 'idea' && <option value="votes">Votes</option>}
            {type === 'idea' && <option value="priorityScore">Priority</option>}
          </select>
          <button
            onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowUpDown size={16} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* Benefit Range Filter for Projects */}
      {type === 'project' && (
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Min Benefit ($)</label>
            <input
              type="number"
              placeholder="e.g., 1000000"
              value={filters.minBenefit || ''}
              onChange={(e) => onFilterChange({ ...filters, minBenefit: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Max Benefit ($)</label>
            <input
              type="number"
              placeholder="e.g., 10000000"
              value={filters.maxBenefit || ''}
              onChange={(e) => onFilterChange({ ...filters, maxBenefit: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.category || filters.status || filters.portfolioId || filters.minBenefit || filters.maxBenefit) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <span className="text-xs text-slate-600">Active filters:</span>
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded">
              {filters.category}
              <X size={12} className="cursor-pointer" onClick={() => onFilterChange({ ...filters, category: null })} />
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded">
              {filters.status}
              <X size={12} className="cursor-pointer" onClick={() => onFilterChange({ ...filters, status: null })} />
            </span>
          )}
          {filters.portfolioId && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
              Portfolio: {portfolios.find(p => p.id === filters.portfolioId)?.name}
              <X size={12} className="cursor-pointer" onClick={() => onFilterChange({ ...filters, portfolioId: null })} />
            </span>
          )}
          {(filters.minBenefit || filters.maxBenefit) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
              ${filters.minBenefit || 0} - ${filters.maxBenefit || '∞'}
              <X size={12} className="cursor-pointer" onClick={() => onFilterChange({ ...filters, minBenefit: null, maxBenefit: null })} />
            </span>
          )}
          <button
            onClick={() => onFilterChange({})}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMMENT COMPONENT
// ============================================================================

const CommentSection = ({ itemId, itemType, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'Current User', // In real app, get from auth
      timestamp: Date.now(),
      itemId,
      itemType
    };
    
    onAddComment(comment);
    setNewComment('');
  };

  return (
    <div className="border-t border-slate-200 pt-4 mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 mb-3"
      >
        <MessageSquare size={16} />
        Comments ({comments.length})
        <ChevronDown size={14} className={`transition-transform ${showComments ? 'rotate-180' : ''}`} />
      </button>

      {showComments && (
        <div className="space-y-3">
          {/* Existing Comments */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CREATE PROJECT MODAL (Enhanced)
// ============================================================================

const CreateProjectModal = ({ onClose, onSubmit, portfolios }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    pm: projectManagers[0],
    benefitProjection: '',
    projectStatus: 'Creation',
    financeApproval: 'Pending',
    health: 'green',
    risk: 'low',
    portfolioId: portfolios[0]?.id || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.benefitProjection) return;
    onSubmit({
      ...formData,
      benefitProjection: parseInt(formData.benefitProjection),
      actualBenefit: 0,
      progress: 0,
      comments: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={20} />Create New Project</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Enter project name" required />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio *</label>
              <select value={formData.portfolioId} onChange={(e) => setFormData({...formData, portfolioId: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Manager *</label>
              <select value={formData.pm} onChange={(e) => setFormData({...formData, pm: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {projectManagers.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Projected Benefits ($) *</label>
              <input type="number" value={formData.benefitProjection} onChange={(e) => setFormData({...formData, benefitProjection: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., 5000000" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Status *</label>
              <select value={formData.projectStatus} onChange={(e) => setFormData({...formData, projectStatus: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Finance Approval *</label>
              <select value={formData.financeApproval} onChange={(e) => setFormData({...formData, financeApproval: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {FINANCE_APPROVAL_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CREATE IDEA MODAL (Enhanced)
const CreateIdeaModal = ({ onClose, onSubmit, portfolios }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    submitter: '',
    portfolioId: portfolios[0]?.id || null,
    scores: { strategicAlignment: 5, financialImpact: 5, feasibility: 5, timeToValue: 5, riskLevel: 5 },
  });

  const priorityScore = calculatePriorityScore(formData.scores);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.submitter.trim()) return;
    onSubmit({ ...formData, votes: 0, status: 'Under Review', priorityScore, comments: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Lightbulb size={20} />Submit New Idea</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Idea Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter idea title" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Describe your idea" rows={3} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio *</label>
              <select value={formData.portfolioId} onChange={(e) => setFormData({...formData, portfolioId: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Name *</label>
              <input type="text" value={formData.submitter} onChange={(e) => setFormData({...formData, submitter: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter your name" required />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Award size={16} className="text-amber-600" />Prioritization Criteria</h3>
              <div className="text-right"><p className="text-xs text-slate-600">Priority Score</p><p className="text-2xl font-bold text-amber-600">{priorityScore}</p></div>
            </div>
            <div className="space-y-4">
              {Object.entries(PRIORITIZATION_CRITERIA).map(([key, criterion]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-700">{criterion.label} ({(criterion.weight * 100).toFixed(0)}%)</label>
                    <span className="text-sm font-semibold text-slate-900">{formData.scores[key]}/{criterion.max}</span>
                  </div>
                  <input type="range" min="0" max={criterion.max} value={formData.scores[key]} onChange={(e) => setFormData({ ...formData, scores: {...formData.scores, [key]: parseInt(e.target.value)} })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">Submit Idea</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PORTFOLIO MANAGEMENT MODAL
const PortfolioModal = ({ portfolios, onClose, onCreate, onUpdate, onDelete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', owner: '', description: '', color: '#0ea5e9' });

  const handleCreate = (e) => {
    e.preventDefault();
    onCreate(newPortfolio);
    setNewPortfolio({ name: '', owner: '', description: '', color: '#0ea5e9' });
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Folder size={20} />Manage Portfolios</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Existing Portfolios */}
          <div className="space-y-3">
            {portfolios.map(portfolio => (
              <div key={portfolio.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: portfolio.color }} />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{portfolio.name}</h3>
                  <p className="text-xs text-slate-500">{portfolio.owner} • {portfolio.description}</p>
                </div>
                <button onClick={() => onDelete(portfolio.id)} className="text-red-600 hover:text-red-700 p-2">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Create New */}
          {!isCreating ? (
            <button onClick={() => setIsCreating(true)} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-violet-500 hover:text-violet-600 transition-colors">
              + Create New Portfolio
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3 p-4 border border-violet-200 bg-violet-50 rounded-lg">
              <input type="text" placeholder="Portfolio Name" value={newPortfolio.name} onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
              <input type="text" placeholder="Owner" value={newPortfolio.owner} onChange={(e) => setNewPortfolio({...newPortfolio, owner: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
              <input type="text" placeholder="Description" value={newPortfolio.description} onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              <div className="flex gap-2">
                <input type="color" value={newPortfolio.color} onChange={(e) => setNewPortfolio({...newPortfolio, color: e.target.value})} className="w-12 h-10 border border-slate-300 rounded-lg" />
                <button type="submit" className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">Create</button>
                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // Data
  const [projects, setProjects] = useState(() => getFromStorage(STORAGE_KEYS.PROJECTS, initialProjectsData));
  const [ideas, setIdeas] = useState(() => getFromStorage(STORAGE_KEYS.IDEAS, initialIdeasData));
  const [portfolios, setPortfolios] = useState(() => getFromStorage(STORAGE_KEYS.PORTFOLIOS, initialPortfolios));
  const [comments, setComments] = useState(() => getFromStorage(STORAGE_KEYS.COMMENTS, []));
  
  // Modals
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateIdea, setShowCreateIdea] = useState(false);
  const [showPortfolios, setShowPortfolios] = useState(false);
  
  // Filters & Sorting
  const [projectFilters, setProjectFilters] = useState({});
  const [projectSortBy, setProjectSortBy] = useState('name');
  const [projectSortDirection, setProjectSortDirection] = useState('asc');
  
  const [ideaFilters, setIdeaFilters] = useState({});
  const [ideaSortBy, setIdeaSortBy] = useState('priorityScore');
  const [ideaSortDirection, setIdeaSortDirection] = useState('desc');

  // Dashboard-specific filters
  const [dashboardFilters, setDashboardFilters] = useState({});

  // AI Agent (Embracy) state
  const [aiMessages, setAiMessages] = useState(() => getFromStorage(STORAGE_KEYS.AI_MESSAGES, [
    { role: 'assistant', content: "👋 Hello! I'm **Embracy**, your AI portfolio assistant. I can help you with:\n\n• Project insights and analysis\n• Risk assessments\n• Portfolio recommendations\n• Benefit projections\n• Idea evaluations\n\nTry asking: *What are my high-risk projects?* or *Show project #3*" }
  ]));
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmbracy, setShowEmbracy] = useState(false);

  // Persist to localStorage
  useEffect(() => setToStorage(STORAGE_KEYS.PROJECTS, projects), [projects]);
  useEffect(() => setToStorage(STORAGE_KEYS.IDEAS, ideas), [ideas]);
  useEffect(() => setToStorage(STORAGE_KEYS.PORTFOLIOS, portfolios), [portfolios]);
  useEffect(() => setToStorage(STORAGE_KEYS.COMMENTS, comments), [comments]);
  useEffect(() => setToStorage(STORAGE_KEYS.AI_MESSAGES, aiMessages), [aiMessages]);

  // Handlers
  const handleCreateProject = (newProject) => {
    const id = Math.max(...projects.map(p => p.id), 0) + 1;
    setProjects([...projects, { id, ...newProject }]);
  };

  const handleCreateIdea = (newIdea) => {
    const id = Math.max(...ideas.map(i => i.id), 0) + 1;
    setIdeas([...ideas, { id, ...newIdea }]);
  };

  const handleCreatePortfolio = (portfolio) => {
    const id = Math.max(...portfolios.map(p => p.id), 0) + 1;
    setPortfolios([...portfolios, { id, ...portfolio }]);
  };

  const handleDeletePortfolio = (id) => {
    if (confirm('Delete this portfolio? Projects/ideas will become unassigned.')) {
      setPortfolios(portfolios.filter(p => p.id !== id));
    }
  };

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
    
    // Also add to the item's comments array
    if (comment.itemType === 'project') {
      setProjects(projects.map(p => 
        p.id === comment.itemId ? { ...p, comments: [...(p.comments || []), comment] } : p
      ));
    } else {
      setIdeas(ideas.map(i => 
        i.id === comment.itemId ? { ...i, comments: [...(i.comments || []), comment] } : i
      ));
    }
  };

  // AI Agent Handler
  const handleAISubmit = () => {
    if (!aiInput.trim()) return;
    
    const userMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsTyping(true);

    setTimeout(() => {
      const input = aiInput.toLowerCase();
      let response = '';

      // Project lookup
      const projectMatch = input.match(/project\s*#?\s*(\d+)/i);
      const ideaMatch = input.match(/idea\s*#?\s*(\d+)/i);

      if (projectMatch) {
        const projectId = parseInt(projectMatch[1]);
        const project = projects.find(p => p.id === projectId);
        if (project) {
          response = `📊 **Project #${project.id}: ${project.name}**\n\n` +
            `**Status:** ${project.projectStatus}\n` +
            `**Finance:** ${project.financeApproval}\n` +
            `**Health:** ${project.health}\n` +
            `**PM:** ${project.pm}\n` +
            `**Category:** ${project.category}\n` +
            `**Benefit Projection:** ${fmt(project.benefitProjection)}\n` +
            `**Actual Benefit:** ${fmt(project.actualBenefit)}\n` +
            `**Progress:** ${project.progress}%\n` +
            `**Risk:** ${project.risk}\n\n` +
            `💡 **Analysis:** This project is ${project.health === 'green' ? 'performing well' : project.health === 'yellow' ? 'needs attention' : 'at risk'}. ` +
            `${project.financeApproval === 'Approved' ? 'Finance approved.' : 'Pending finance approval.'}`;
        } else {
          response = `❌ Project #${projectId} not found. Available projects: ${projects.map(p => `#${p.id}`).join(', ')}`;
        }
      } else if (ideaMatch) {
        const ideaId = parseInt(ideaMatch[1]);
        const idea = ideas.find(i => i.id === ideaId);
        if (idea) {
          const score = calculatePriorityScore(idea.scores);
          response = `💡 **Idea #${idea.id}: ${idea.title}**\n\n` +
            `**Status:** ${idea.status}\n` +
            `**Category:** ${idea.category}\n` +
            `**Submitter:** ${idea.submitter}\n` +
            `**Priority Score:** ${score}/100\n` +
            `**Votes:** ${idea.votes}\n\n` +
            `**Scoring Breakdown:**\n` +
            `• Strategic Alignment: ${idea.scores.strategicAlignment}/10\n` +
            `• Financial Impact: ${idea.scores.financialImpact}/10\n` +
            `• Feasibility: ${idea.scores.feasibility}/10\n` +
            `• Time to Value: ${idea.scores.timeToValue}/10\n` +
            `• Risk Level: ${idea.scores.riskLevel}/10\n\n` +
            `💡 **Recommendation:** ${score >= 70 ? '✅ High priority - consider converting to project' : score >= 50 ? '⚠️ Medium priority - needs refinement' : '❌ Low priority - needs significant improvement'}`;
        } else {
          response = `❌ Idea #${ideaId} not found. Available ideas: ${ideas.map(i => `#${i.id}`).join(', ')}`;
        }
      } else if (input.includes('risk') || input.includes('high risk')) {
        const highRisk = projects.filter(p => p.risk === 'high' || p.health === 'red');
        response = `⚠️ **High-Risk Projects** (${highRisk.length} found)\n\n` +
          highRisk.map(p => `• **#${p.id}:** ${p.name} - ${p.projectStatus} (${p.health})`).join('\n') +
          `\n\n💡 **Recommendation:** Focus on these projects for immediate intervention.`;
      } else if (input.includes('finance') || input.includes('approval')) {
        const pending = projects.filter(p => p.financeApproval === 'Pending');
        const rejected = projects.filter(p => p.financeApproval === 'Rejected');
        response = `💰 **Finance Status Overview**\n\n` +
          `**Pending Approval:** ${pending.length} projects\n` +
          pending.slice(0, 5).map(p => `• #${p.id}: ${p.name} - ${fmt(p.benefitProjection)}`).join('\n') +
          `\n\n**Rejected:** ${rejected.length} projects\n` +
          `**Approved:** ${projects.filter(p => p.financeApproval === 'Approved').length} projects`;
      } else if (input.includes('benefit') || input.includes('value')) {
        const total = projects.reduce((sum, p) => sum + p.benefitProjection, 0);
        const realized = projects.reduce((sum, p) => sum + p.actualBenefit, 0);
        const topProjects = [...projects].sort((a, b) => b.benefitProjection - a.benefitProjection).slice(0, 5);
        response = `💵 **Benefits Analysis**\n\n` +
          `**Total Projected:** ${fmt(total)}\n` +
          `**Total Realized:** ${fmt(realized)}\n` +
          `**Realization Rate:** ${Math.round((realized / total) * 100)}%\n\n` +
          `**Top 5 Projects by Value:**\n` +
          topProjects.map((p, i) => `${i + 1}. #${p.id}: ${p.name} - ${fmt(p.benefitProjection)}`).join('\n');
      } else if (input.includes('portfolio')) {
        response = `📁 **Portfolio Overview** (${portfolios.length} portfolios)\n\n` +
          portfolios.map(pf => {
            const pfProjects = projects.filter(p => p.portfolioId === pf.id);
            const pfValue = pfProjects.reduce((sum, p) => sum + p.benefitProjection, 0);
            return `• **${pf.name}**: ${pfProjects.length} projects, ${fmt(pfValue)} value`;
          }).join('\n');
      } else if (input.includes('summary') || input.includes('overview')) {
        response = `📊 **Portfolio Summary**\n\n` +
          `**Projects:** ${projects.length} total\n` +
          `• Active: ${projects.filter(p => p.projectStatus === 'Execution').length}\n` +
          `• Planning: ${projects.filter(p => p.projectStatus === 'Feasibility Assessment').length}\n` +
          `• Finance Approved: ${projects.filter(p => p.financeApproval === 'Approved').length}\n\n` +
          `**Ideas:** ${ideas.length} in pipeline\n` +
          `• High Priority (70+): ${ideas.filter(i => calculatePriorityScore(i.scores) >= 70).length}\n\n` +
          `**Health Status:**\n` +
          `• 🟢 Green: ${projects.filter(p => p.health === 'green').length}\n` +
          `• 🟡 Yellow: ${projects.filter(p => p.health === 'yellow').length}\n` +
          `• 🔴 Red: ${projects.filter(p => p.health === 'red').length}`;
      } else if (input.includes('help') || input.includes('what can you')) {
        response = `🤖 **I can help you with:**\n\n` +
          `**Project Queries:**\n` +
          `• "Show project #3" - Get project details\n` +
          `• "High risk projects" - Find at-risk projects\n` +
          `• "Finance approvals" - Review pending approvals\n\n` +
          `**Analytics:**\n` +
          `• "Benefits analysis" - Value and realization rates\n` +
          `• "Portfolio overview" - Portfolio breakdown\n` +
          `• "Summary" - Overall portfolio health\n\n` +
          `**Ideas:**\n` +
          `• "Show idea #2" - Get idea details\n` +
          `• "Top ideas" - Highest scoring ideas\n\n` +
          `Just ask naturally, and I'll help! 😊`;
      } else {
        response = `🤔 I'm not sure about that. Try asking:\n\n` +
          `• "Show project #1"\n` +
          `• "What are high-risk projects?"\n` +
          `• "Finance approval status"\n` +
          `• "Benefits analysis"\n` +
          `• "Portfolio overview"\n` +
          `• "Help" for more options`;
      }

      setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  // Filtering & Sorting Logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (projectFilters.category && p.category !== projectFilters.category) return false;
      if (projectFilters.status && p.projectStatus !== projectFilters.status) return false;
      if (projectFilters.portfolioId && p.portfolioId !== projectFilters.portfolioId) return false;
      if (projectFilters.minBenefit && p.benefitProjection < projectFilters.minBenefit) return false;
      if (projectFilters.maxBenefit && p.benefitProjection > projectFilters.maxBenefit) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const aVal = a[projectSortBy];
      const bVal = b[projectSortBy];
      const modifier = projectSortDirection === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * modifier;
      return (aVal - bVal) * modifier;
    });
  }, [projects, projectFilters, projectSortBy, projectSortDirection, searchQuery]);

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas.filter(i => {
      if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (ideaFilters.category && i.category !== ideaFilters.category) return false;
      if (ideaFilters.status && i.status !== ideaFilters.status) return false;
      if (ideaFilters.portfolioId && i.portfolioId !== ideaFilters.portfolioId) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      let aVal = a[ideaSortBy];
      let bVal = b[ideaSortBy];
      
      // Calculate priority score if sorting by it
      if (ideaSortBy === 'priorityScore') {
        aVal = calculatePriorityScore(a.scores);
        bVal = calculatePriorityScore(b.scores);
      }
      
      const modifier = ideaSortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * modifier;
      return (aVal - bVal) * modifier;
    });
  }, [ideas, ideaFilters, ideaSortBy, ideaSortDirection, searchQuery]);

  // Dashboard-specific filtered data
  const dashboardFilteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (dashboardFilters.category && p.category !== dashboardFilters.category) return false;
      if (dashboardFilters.status && p.projectStatus !== dashboardFilters.status) return false;
      if (dashboardFilters.portfolioId && p.portfolioId !== dashboardFilters.portfolioId) return false;
      return true;
    });
  }, [projects, dashboardFilters, searchQuery]);

  // Benefits chart data
  const benefitsChartData = useMemo(() => generateYearlyData(selectedYear), [selectedYear]);

  // Category data from actual projects
  const categoryChartData = useMemo(() => {
    const categoryTotals = {};
    dashboardFilteredProjects.forEach(p => {
      categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.benefitProjection;
    });
    
    const colors = {
      'Production': '#0ea5e9', 'Distribution': '#10b981', 'ESG': '#8b5cf6',
      'Technology': '#f59e0b', 'Healthcare': '#ef4444', 'Operations': '#06b6d4',
      'CapEx': '#ec4899', 'Customer': '#14b8a6'
    };
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748b'
    }));
  }, [dashboardFilteredProjects]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white text-sm">ProductivitySymphony</h1>
              <p className="text-xs text-slate-500">Industrial Gas PMO</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-3">Overview</p>
          <NavItem icon={BarChart3} label="Dashboard" view="dashboard" activeView={activeView} onClick={() => setActiveView('dashboard')} />
          <NavItem icon={Folder} label="Portfolios" view="portfolios" badge={portfolios.length} activeView={activeView} onClick={() => setActiveView('portfolios')} />
          <NavItem icon={FolderKanban} label="Projects" view="projects" badge={projects.length} activeView={activeView} onClick={() => setActiveView('projects')} />
          <NavItem icon={Lightbulb} label="Ideas Pipeline" view="ideas" badge={ideas.length} activeView={activeView} onClick={() => setActiveView('ideas')} />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Analytics</p>
          <NavItem icon={TrendingUp} label="Benefits Tracker" view="benefits" activeView={activeView} onClick={() => setActiveView('benefits')} />
          <NavItem icon={FileText} label="Reports" view="reports" activeView={activeView} onClick={() => setActiveView('reports')} />
          <NavItem icon={Database} label="Data" view="data" activeView={activeView} onClick={() => setActiveView('data')} />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Intelligence</p>
          <NavItem icon={Bot} label="AI Agent (Embracy)" view="embracy" activeView={activeView} onClick={() => setActiveView('embracy')} />
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-1">
          <NavItem icon={Settings} label="Settings" view="settings" activeView={activeView} onClick={() => setActiveView('settings')} />
        </div>
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">SC</div>
            <div><p className="text-sm font-medium text-white">Sarah Chen</p><p className="text-xs text-slate-500">Portfolio Director</p></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search projects, ideas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPortfolios(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
              <Folder size={16} />
              Portfolios
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Dashboard */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Portfolio Dashboard</h1><p className="text-slate-500 text-sm mt-1">Real-time overview of your portfolio</p></div>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreateProject(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"><Plus size={16} />New Project</button>
                  <button onClick={() => setShowCreateIdea(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"><Lightbulb size={16} />New Idea</button>
                </div>
              </div>

              {/* Dashboard Filters */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <SlidersHorizontal size={16} />
                  Dashboard Filters
                </div>
                <div className="grid md:grid-cols-5 gap-3">
                  <select
                    value={dashboardFilters.category || 'all'}
                    onChange={(e) => setDashboardFilters({ ...dashboardFilters, category: e.target.value === 'all' ? null : e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>

                  <select
                    value={dashboardFilters.status || 'all'}
                    onChange={(e) => setDashboardFilters({ ...dashboardFilters, status: e.target.value === 'all' ? null : e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Project Statuses</option>
                    {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>

                  <select
                    value={dashboardFilters.financeApproval || 'all'}
                    onChange={(e) => setDashboardFilters({ ...dashboardFilters, financeApproval: e.target.value === 'all' ? null : e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Finance Status</option>
                    {FINANCE_APPROVAL_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>

                  <select
                    value={dashboardFilters.portfolioId || 'all'}
                    onChange={(e) => setDashboardFilters({ ...dashboardFilters, portfolioId: e.target.value === 'all' ? null : parseInt(e.target.value) })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Portfolios</option>
                    {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>

                  <button
                    onClick={() => setDashboardFilters({})}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Active Filters Display */}
                {(dashboardFilters.category || dashboardFilters.status || dashboardFilters.portfolioId || dashboardFilters.financeApproval) && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Active:</span>
                    {dashboardFilters.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded">
                        {dashboardFilters.category}
                        <X size={12} className="cursor-pointer" onClick={() => setDashboardFilters({ ...dashboardFilters, category: null })} />
                      </span>
                    )}
                    {dashboardFilters.status && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded">
                        {dashboardFilters.status}
                        <X size={12} className="cursor-pointer" onClick={() => setDashboardFilters({ ...dashboardFilters, status: null })} />
                      </span>
                    )}
                    {dashboardFilters.financeApproval && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                        Finance: {dashboardFilters.financeApproval}
                        <X size={12} className="cursor-pointer" onClick={() => setDashboardFilters({ ...dashboardFilters, financeApproval: null })} />
                      </span>
                    )}
                    {dashboardFilters.portfolioId && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                        {portfolios.find(p => p.id === dashboardFilters.portfolioId)?.name}
                        <X size={12} className="cursor-pointer" onClick={() => setDashboardFilters({ ...dashboardFilters, portfolioId: null })} />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard 
                  icon={FolderKanban} 
                  label="Filtered Projects" 
                  value={dashboardFilteredProjects.length} 
                  sub={`${projects.length} total`} 
                />
                <StatCard 
                  icon={DollarSign} 
                  label="Total Projected Benefits" 
                  value={fmt(dashboardFilteredProjects.reduce((sum, p) => sum + p.benefitProjection, 0))} 
                />
                <StatCard 
                  icon={Target} 
                  label="Total Realized" 
                  value={fmt(dashboardFilteredProjects.reduce((sum, p) => sum + p.actualBenefit, 0))} 
                />
                <StatCard 
                  icon={CheckCircle} 
                  label="Finance Approved" 
                  value={dashboardFilteredProjects.filter(p => p.financeApproval === 'Approved').length}
                  sub={`${dashboardFilteredProjects.filter(p => p.financeApproval === 'Pending').length} pending`}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-4">
                {/* 12-Month Benefits Chart */}
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">12-Month Benefits Tracking</h3>
                      <p className="text-xs text-slate-500">Forecast vs Actual ($K)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                      </select>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-slate-300 rounded-full"/>Forecast
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"/>Actual
                        </span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={benefitsChartData}>
                      <defs>
                        <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
                      <Area type="monotone" dataKey="forecast" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} fill="url(#actualG)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Benefits by Category Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">Benefits by Category</h3>
                  <p className="text-xs text-slate-500 mb-3">Portfolio allocation</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie 
                        data={categoryChartData}
                        cx="50%" 
                        cy="50%" 
                        innerRadius={40} 
                        outerRadius={65} 
                        paddingAngle={3} 
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => fmt(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {categoryChartData.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}/>
                        <span className="text-xs text-slate-600 truncate">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Projects Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-semibold text-slate-900">Active Projects</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing {dashboardFilteredProjects.filter(p => p.projectStatus !== 'Benefit Tracking').length} active projects
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const exportData = dashboardFilteredProjects
                        .filter(p => p.projectStatus !== 'Benefit Tracking')
                        .map(p => ({
                          ID: p.id,
                          Name: p.name,
                          Portfolio: portfolios.find(pf => pf.id === p.portfolioId)?.name || '',
                          Category: p.category,
                          PM: p.pm,
                          'Project Status': p.projectStatus,
                          'Finance Approval': p.financeApproval,
                          Health: p.health,
                          'Benefit Projection': p.benefitProjection,
                          'Actual Benefit': p.actualBenefit,
                          'Progress %': p.progress
                        }));
                      exportToCSV(exportData, 'dashboard_active_projects');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <FileDown size={14} />
                    Export CSV
                  </button>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Portfolio</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Finance</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Health</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Benefit</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardFilteredProjects
                      .filter(p => p.projectStatus !== 'Benefit Tracking')
                      .slice(0, 10)
                      .map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-0.5 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            #{p.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.pm} • {p.category}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: portfolios.find(pf => pf.id === p.portfolioId)?.color }} />
                            <span className="text-xs text-slate-600">{portfolios.find(pf => pf.id === p.portfolioId)?.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={p.projectStatus} type="project" />
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={p.financeApproval} type="finance" />
                        </td>
                        <td className="px-5 py-4"><HealthDot health={p.health} /></td>
                        <td className="px-5 py-4"><span className="font-semibold text-slate-900 text-sm">{fmt(p.benefitProjection)}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-slate-200 rounded-full h-1.5">
                              <div className="bg-sky-500 h-1.5 rounded-full" style={{width: `${p.progress}%`}}/>
                            </div>
                            <span className="text-xs text-slate-500">{p.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {dashboardFilteredProjects.filter(p => p.projectStatus !== 'Benefit Tracking').length > 10 && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => setActiveView('projects')}
                      className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      View All {dashboardFilteredProjects.filter(p => p.projectStatus !== 'Benefit Tracking').length} Active Projects →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects View with Advanced Filtering */}
          {activeView === 'projects' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Projects</h1><p className="text-slate-500 text-sm mt-1">Manage your project portfolio</p></div>
                <button onClick={() => setShowCreateProject(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"><Plus size={16} />New Project</button>
              </div>

              <FilterSortControls
                onFilterChange={setProjectFilters}
                onSortChange={(sortBy, direction) => { setProjectSortBy(sortBy); setProjectSortDirection(direction); }}
                filters={projectFilters}
                sortBy={projectSortBy}
                sortDirection={projectSortDirection}
                availableCategories={categories}
                availableStatuses={PROJECT_STATUSES}
                showPortfolio={true}
                portfolios={portfolios}
                type="project"
              />

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-semibold text-slate-900">All Projects ({filteredAndSortedProjects.length})</h3>
                  <button 
                    onClick={() => {
                      const exportData = filteredAndSortedProjects.map(p => ({
                        ID: p.id,
                        Name: p.name,
                        Portfolio: portfolios.find(pf => pf.id === p.portfolioId)?.name || '',
                        Category: p.category,
                        PM: p.pm,
                        'Project Status': p.projectStatus,
                        'Finance Approval': p.financeApproval,
                        Health: p.health,
                        'Benefit Projection': p.benefitProjection,
                        'Actual Benefit': p.actualBenefit,
                        'Progress %': p.progress,
                        Risk: p.risk
                      }));
                      exportToCSV(exportData, 'projects');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <FileDown size={14} />
                    Export CSV
                  </button>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Portfolio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Finance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Benefit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAndSortedProjects.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">#{p.id}</span></td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.pm} • {p.category}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: portfolios.find(pf => pf.id === p.portfolioId)?.color }} />
                            <span className="text-xs text-slate-600">{portfolios.find(pf => pf.id === p.portfolioId)?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusPill status={p.projectStatus} type="project" /></td>
                        <td className="px-4 py-3"><StatusPill status={p.financeApproval} type="finance" /></td>
                        <td className="px-4 py-3"><HealthDot health={p.health} /></td>
                        <td className="px-4 py-3"><span className="text-sm font-semibold text-slate-900">{fmt(p.benefitProjection)}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                              <div className="bg-sky-500 h-1.5 rounded-full" style={{width: `${p.progress}%`}} />
                            </div>
                            <span className="text-xs text-slate-500">{p.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-slate-500">Showing {filteredAndSortedProjects.length} of {projects.length} projects</p>
            </div>
          )}

          {/* Ideas View with Advanced Filtering */}
          {activeView === 'ideas' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Ideas Pipeline</h1><p className="text-slate-500 text-sm mt-1">Evaluate and convert ideas</p></div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const exportData = filteredAndSortedIdeas.map(i => ({
                        ID: i.id,
                        Title: i.title,
                        Description: i.description || '',
                        Portfolio: portfolios.find(p => p.id === i.portfolioId)?.name || '',
                        Category: i.category,
                        Submitter: i.submitter,
                        Status: i.status,
                        Votes: i.votes,
                        'Priority Score': calculatePriorityScore(i.scores),
                        'Strategic Alignment': i.scores.strategicAlignment,
                        'Financial Impact': i.scores.financialImpact,
                        Feasibility: i.scores.feasibility,
                        'Time to Value': i.scores.timeToValue,
                        'Risk Level': i.scores.riskLevel
                      }));
                      exportToCSV(exportData, 'ideas');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <FileDown size={14} />
                    Export CSV
                  </button>
                  <button onClick={() => setShowCreateIdea(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"><Plus size={16} />Submit Idea</button>
                </div>
              </div>

              <FilterSortControls
                onFilterChange={setIdeaFilters}
                onSortChange={(sortBy, direction) => { setIdeaSortBy(sortBy); setIdeaSortDirection(direction); }}
                filters={ideaFilters}
                sortBy={ideaSortBy}
                sortDirection={ideaSortDirection}
                availableCategories={categories}
                availableStatuses={['Under Review', 'Approved', 'Converting']}
                showPortfolio={true}
                portfolios={portfolios}
                type="idea"
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedIdeas.map(idea => {
                  const score = calculatePriorityScore(idea.scores);
                  return (
                    <div key={idea.id} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-mono bg-amber-50 px-2 py-0.5 rounded text-amber-700">#{idea.id}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded">
                            <Star size={12} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-700">{score}</span>
                          </div>
                          <StatusPill status={idea.status} type="idea" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{idea.title}</h3>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{idea.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: portfolios.find(p => p.id === idea.portfolioId)?.color }} />
                        <span className="text-xs text-slate-500">{portfolios.find(p => p.id === idea.portfolioId)?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
                        <span className="text-slate-600">{idea.submitter}</span>
                        <span className="text-slate-900 font-medium">{idea.votes} votes</span>
                      </div>
                      <CommentSection
                        itemId={idea.id}
                        itemType="idea"
                        comments={idea.comments || []}
                        onAddComment={handleAddComment}
                      />
                    </div>
                  );
                })}
              </div>
              
              <p className="text-sm text-slate-500">Showing {filteredAndSortedIdeas.length} of {ideas.length} ideas</p>
            </div>
          )}

          {/* Enhanced Portfolios View with Charts */}
          {activeView === 'portfolios' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Portfolios</h1><p className="text-slate-500 text-sm mt-1">Organize projects and ideas</p></div>
                <button onClick={() => setShowPortfolios(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm"><Plus size={16} />New Portfolio</button>
              </div>

              {/* Portfolio Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map(portfolio => {
                  const portfolioProjects = projects.filter(p => p.portfolioId === portfolio.id);
                  const portfolioIdeas = ideas.filter(i => i.portfolioId === portfolio.id);
                  const totalBenefit = portfolioProjects.reduce((sum, p) => sum + p.benefitProjection, 0);
                  
                  return (
                    <div key={portfolio.id} className="bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all" style={{ borderColor: portfolio.color }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: portfolio.color + '20' }}>
                            <Folder size={24} style={{ color: portfolio.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{portfolio.name}</h3>
                            <p className="text-xs text-slate-500">{portfolio.owner}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{portfolio.description}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Projects</p>
                          <p className="text-lg font-bold text-slate-900">{portfolioProjects.length}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Ideas</p>
                          <p className="text-lg font-bold text-slate-900">{portfolioIdeas.length}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Value</p>
                          <p className="text-lg font-bold text-slate-900">{fmt(totalBenefit)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Portfolio Analytics Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* 12-Month Benefits Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">12-Month Portfolio Benefits</h3>
                      <p className="text-xs text-slate-500">Forecast vs Actual ($K)</p>
                    </div>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={benefitsChartData}>
                      <defs>
                        <linearGradient id="portfolioActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
                      <Area type="monotone" dataKey="forecast" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} fill="url(#portfolioActual)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Benefits by Category Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-1">Benefits by Category</h3>
                  <p className="text-xs text-slate-500 mb-3">Portfolio allocation</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => fmt(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1 mt-3">
                    {categoryChartData.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}} />
                        <span className="text-xs text-slate-600 truncate">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Agent (Embracy) View - COMPLETE */}
          {activeView === 'embracy' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-200">
                  <Bot size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">AI Agent: Embracy</h1>
                <p className="text-slate-500 text-sm mt-1">Your intelligent portfolio assistant</p>
              </div>

              {/* Chat Interface */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white' 
                          : 'bg-white border-2 border-violet-100 text-slate-900'
                      }`}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                              <Bot size={14} className="text-white" />
                            </div>
                            <span className="text-xs font-semibold text-violet-600">Embracy</span>
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-line">
                          {msg.content.split('**').map((part, i) => 
                            i % 2 === 0 ? part : <strong key={i} className="font-bold">{part}</strong>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-violet-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <form onSubmit={(e) => { e.preventDefault(); handleAISubmit(); }} className="flex gap-3">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask about projects, ideas, risks, benefits..."
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!aiInput.trim() || isTyping}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={18} />
                      Send
                    </button>
                  </form>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setAiInput('Summary')} className="px-3 py-1 text-xs bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors">
                      📊 Summary
                    </button>
                    <button onClick={() => setAiInput('High risk projects')} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      ⚠️ High Risk
                    </button>
                    <button onClick={() => setAiInput('Finance approvals')} className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                      💰 Finance
                    </button>
                    <button onClick={() => setAiInput('Benefits analysis')} className="px-3 py-1 text-xs bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors">
                      💵 Benefits
                    </button>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-600" />
                  Try These Queries:
                </h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                  <div>• "Show project #1"</div>
                  <div>• "What are high-risk projects?"</div>
                  <div>• "Finance approval status"</div>
                  <div>• "Benefits analysis"</div>
                  <div>• "Portfolio overview"</div>
                  <div>• "Show idea #2"</div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Tracker View - COMPLETE WITH CARDS AND CHARTS */}
          {activeView === 'benefits' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Benefits Tracker</h1>
                  <p className="text-slate-500 text-sm mt-1">Monitor value realization and ROI</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                  <button
                    onClick={() => {
                      const monthlyData = benefitsChartData;
                      const exportData = monthlyData.map(m => ({
                        Month: m.month,
                        'Forecast ($K)': m.forecast,
                        'Actual ($K)': m.actual,
                        'Variance ($K)': m.actual - m.forecast,
                        'Variance %': m.forecast > 0 ? Math.round(((m.actual - m.forecast) / m.forecast) * 100) : 0
                      }));
                      exportToCSV(exportData, `benefits_tracker_${selectedYear}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <FileDown size={14} />
                    Export
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign size={24} className="opacity-80" />
                    <TrendingUp size={20} className="opacity-60" />
                  </div>
                  <p className="text-3xl font-bold">{fmt(projects.reduce((sum, p) => sum + p.benefitProjection, 0))}</p>
                  <p className="text-sm opacity-90 mt-1">Total Projected Benefits</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-75">{projects.length} active projects</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Target size={24} className="opacity-80" />
                    <CheckCircle size={20} className="opacity-60" />
                  </div>
                  <p className="text-3xl font-bold">{fmt(projects.reduce((sum, p) => sum + p.actualBenefit, 0))}</p>
                  <p className="text-sm opacity-90 mt-1">Total Realized Benefits</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-75">
                      {Math.round((projects.reduce((sum, p) => sum + p.actualBenefit, 0) / projects.reduce((sum, p) => sum + p.benefitProjection, 0)) * 100)}% realization rate
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Activity size={24} className="opacity-80" />
                    <TrendingUp size={20} className="opacity-60" />
                  </div>
                  <p className="text-3xl font-bold">
                    {fmt(projects.reduce((sum, p) => sum + p.benefitProjection, 0) - projects.reduce((sum, p) => sum + p.actualBenefit, 0))}
                  </p>
                  <p className="text-sm opacity-90 mt-1">Remaining Benefits</p>
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Activity size={24} className="opacity-80" />
                    <TrendingUp size={20} className="opacity-60" />
                  </div>
                  <p className="text-3xl font-bold">
                    {fmt(projects.reduce((sum, p) => sum + p.benefitProjection, 0) - projects.reduce((sum, p) => sum + p.actualBenefit, 0))}
                  </p>
                  <p className="text-sm opacity-90 mt-1">Remaining Benefits</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-75">To be realized</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar size={24} className="opacity-80" />
                    <Clock size={20} className="opacity-60" />
                  </div>
                  <p className="text-3xl font-bold">{selectedYear}</p>
                  <p className="text-sm opacity-90 mt-1">Current Fiscal Year</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-75">YTD Performance</p>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Cascade/Waterfall Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Benefits Cascade Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={[
                      { name: 'Projected', value: projects.reduce((sum, p) => sum + p.benefitProjection, 0), fill: '#0ea5e9' },
                      { name: 'Realized', value: projects.reduce((sum, p) => sum + p.actualBenefit, 0), fill: '#10b981' },
                      { name: 'Variance', value: projects.reduce((sum, p) => sum + p.benefitProjection, 0) - projects.reduce((sum, p) => sum + p.actualBenefit, 0), fill: '#f59e0b' },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => fmt(v)} />
                      <Tooltip formatter={(value) => fmt(value)} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {[0, 1, 2].map((index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : index === 1 ? '#10b981' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Monthly Benefits Trend ({selectedYear})</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={benefitsChartData}>
                      <defs>
                        <linearGradient id="benefitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="forecast" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#benefitGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Project Benefits Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Project Benefits Breakdown</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Projected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Realized</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Variance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map(p => {
                      const variance = p.actualBenefit - p.benefitProjection;
                      const variancePercent = p.benefitProjection > 0 ? Math.round((variance / p.benefitProjection) * 100) : 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.pm}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">{p.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-slate-900">{fmt(p.benefitProjection)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-emerald-600">{fmt(p.actualBenefit)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {variance >= 0 ? '+' : ''}{fmt(variance)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${variance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {variancePercent >= 0 ? '+' : ''}{variancePercent}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusPill status={p.projectStatus} type="project" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports View - COMPLETE WITH ALL GRAPHICS */}
          {activeView === 'reports' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
                  <p className="text-slate-500 text-sm mt-1">Comprehensive portfolio insights</p>
                </div>
                <button
                  onClick={() => {
                    const exportData = projects.map(p => ({
                      ID: p.id,
                      Name: p.name,
                      Portfolio: portfolios.find(pf => pf.id === p.portfolioId)?.name || '',
                      Category: p.category,
                      PM: p.pm,
                      'Project Status': p.projectStatus,
                      'Finance Approval': p.financeApproval,
                      Health: p.health,
                      'Benefit Projection': p.benefitProjection,
                      'Actual Benefit': p.actualBenefit,
                      Variance: p.actualBenefit - p.benefitProjection,
                      'Variance %': p.benefitProjection > 0 ? Math.round(((p.actualBenefit - p.benefitProjection) / p.benefitProjection) * 100) : 0,
                      'Progress %': p.progress,
                      Risk: p.risk
                    }));
                    exportToCSV(exportData, 'portfolio_report');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"
                >
                  <FileDown size={14} />
                  Export Full Report
                </button>
              </div>

              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-3xl font-bold">{projects.length}</p>
                    <p className="text-slate-300 text-sm mt-1">Total Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{fmt(projects.reduce((sum, p) => sum + p.benefitProjection, 0))}</p>
                    <p className="text-slate-300 text-sm mt-1">Total Value</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{Math.round((projects.reduce((sum, p) => sum + p.actualBenefit, 0) / projects.reduce((sum, p) => sum + p.benefitProjection, 0)) * 100)}%</p>
                    <p className="text-slate-300 text-sm mt-1">Realization Rate</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%</p>
                    <p className="text-slate-300 text-sm mt-1">Avg Completion</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Health Dashboard */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Project Health Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Green', value: projects.filter(p => p.health === 'green').length, color: '#10b981' },
                          { name: 'Yellow', value: projects.filter(p => p.health === 'yellow').length, color: '#f59e0b' },
                          { name: 'Red', value: projects.filter(p => p.health === 'red').length, color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1" />
                      <p className="text-lg font-bold text-slate-900">{projects.filter(p => p.health === 'green').length}</p>
                      <p className="text-xs text-slate-500">Green</p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1" />
                      <p className="text-lg font-bold text-slate-900">{projects.filter(p => p.health === 'yellow').length}</p>
                      <p className="text-xs text-slate-500">Yellow</p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
                      <p className="text-lg font-bold text-slate-900">{projects.filter(p => p.health === 'red').length}</p>
                      <p className="text-xs text-slate-500">Red</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Finance Approval Status</h3>
                  <div className="space-y-3">
                    {FINANCE_APPROVAL_STATUSES.map(status => {
                      const count = projects.filter(p => p.financeApproval === status).length;
                      const percent = Math.round((count / projects.length) * 100);
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-600">{status}</span>
                            <span className="text-sm font-semibold text-slate-900">{count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                status === 'Approved' ? 'bg-emerald-500' :
                                status === 'Pending' ? 'bg-amber-500' :
                                status === 'Rejected' ? 'bg-red-500' : 'bg-slate-400'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Project Lifecycle Stage</h3>
                  <div className="space-y-3">
                    {PROJECT_STATUSES.map(status => {
                      const count = projects.filter(p => p.projectStatus === status).length;
                      const percent = Math.round((count / projects.length) * 100);
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">{status}</span>
                            <span className="text-sm font-semibold text-slate-900">{count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Performance by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categories.map(cat => {
                    const catProjects = projects.filter(p => p.category === cat);
                    return {
                      category: cat,
                      projected: catProjects.reduce((sum, p) => sum + p.benefitProjection, 0),
                      realized: catProjects.reduce((sum, p) => sum + p.actualBenefit, 0),
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => fmt(v)} />
                    <Tooltip formatter={(value) => fmt(value)} />
                    <Bar dataKey="projected" fill="#0ea5e9" name="Projected" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="realized" fill="#10b981" name="Realized" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Analysis */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Risk Profile Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-semibold text-red-900">High Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600 mb-1">{projects.filter(p => p.risk === 'high').length}</p>
                    <p className="text-xs text-red-700">Requires immediate attention</p>
                    <div className="mt-3 space-y-1">
                      {projects.filter(p => p.risk === 'high').slice(0, 3).map(p => (
                        <p key={p.id} className="text-xs text-red-800 truncate">• {p.name}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="font-semibold text-amber-900">Medium Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mb-1">{projects.filter(p => p.risk === 'medium').length}</p>
                    <p className="text-xs text-amber-700">Monitor closely</p>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="font-semibold text-emerald-900">Low Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 mb-1">{projects.filter(p => p.risk === 'low').length}</p>
                    <p className="text-xs text-emerald-700">On track</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="grid lg:grid-cols-3 gap-6">
                {portfolios.map(portfolio => {
                  const pfProjects = projects.filter(p => p.portfolioId === portfolio.id);
                  const pfValue = pfProjects.reduce((sum, p) => sum + p.benefitProjection, 0);
                  const pfRealized = pfProjects.reduce((sum, p) => sum + p.actualBenefit, 0);
                  
                  return (
                    <div key={portfolio.id} className="bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all" style={{ borderColor: portfolio.color }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: portfolio.color + '20' }}>
                          <Folder size={24} style={{ color: portfolio.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{portfolio.name}</h3>
                          <p className="text-xs text-slate-500">{portfolio.owner}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Projects</p>
                          <p className="text-2xl font-bold text-slate-900">{pfProjects.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Total Value</p>
                          <p className="text-lg font-semibold text-slate-900">{fmt(pfValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Realized</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-semibold text-emerald-600">{fmt(pfRealized)}</p>
                            <span className="text-xs text-slate-500">({pfValue > 0 ? Math.round((pfRealized / pfValue) * 100) : 0}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Data View */}
          {activeView === 'data' && (
            // ... (your existing Data view code)
          )}

          {/* Floating AI Widget */}
          {showEmbracy && (
            <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-violet-200 z-50">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Bot size={20} />
                  <span className="font-semibold">Embracy</span>
                </div>
                <button onClick={() => setShowEmbracy(false)} className="text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {aiMessages.slice(-5).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white border border-violet-100'
                    }`}>
                      {msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-200">
                <button 
                  onClick={() => setActiveView('embracy')}
                  className="w-full py-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Open Full Chat →
                </button>
              </div>
            </div>
          )}

          {/* Floating AI Button (when widget closed) */}
          {!showEmbracy && (
            <button
              onClick={() => setShowEmbracy(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
            >
              <Bot size={24} />
            </button>
          )}

        </div>
      </main>

      {/* Modals */}
      {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} onSubmit={handleCreateProject} portfolios={portfolios} />}
      {showCreateIdea && <CreateIdeaModal onClose={() => setShowCreateIdea(false)} onSubmit={handleCreateIdea} portfolios={portfolios} />}
      {showPortfolios && <PortfolioModal portfolios={portfolios} onClose={() => setShowPortfolios(false)} onCreate={handleCreatePortfolio} onUpdate={() => {}} onDelete={handleDeletePortfolio} />}
    </div>
  );
}
