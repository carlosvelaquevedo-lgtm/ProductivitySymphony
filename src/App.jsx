import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Line, ComposedChart } from 'recharts';
import { Search, Plus, ChevronRight, Filter, Bell, Settings, FolderKanban, Lightbulb, TrendingUp, FileText, Users, DollarSign, Target, ArrowLeft, ArrowRight, MoreHorizontal, X, Sparkles, Activity, BarChart3, Circle, Send, Cpu, ChevronUp, ChevronDown, HelpCircle, Database, Hash, Star, Award, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// ============================================================================
// CONSTANTS & INITIAL DATA
// ============================================================================

const STORAGE_KEYS = {
  PROJECTS: 'productivity_symphony_projects_v2',
  IDEAS: 'productivity_symphony_ideas_v2',
  AI_MESSAGES: 'productivity_symphony_ai_messages',
  THEME: 'productivity_symphony_theme',
};

const stages = ['Ideation', 'Planning', 'Gate Review', 'Execution', 'Closing', 'Closed'];
const categories = ['Production', 'Distribution', 'ESG', 'Technology', 'Healthcare', 'Operations', 'CapEx', 'Customer'];
const projectManagers = ['Sarah Chen', 'Michael Ross', 'Emily Watson', 'David Kim', 'Lisa Park', 'James Miller', 'Nina Patel', 'Robert Chen', 'Amanda Foster', 'Thomas Wright'];

// PRIORITIZATION CRITERIA
const PRIORITIZATION_CRITERIA = {
  strategicAlignment: { label: 'Strategic Alignment', weight: 0.25, max: 10 },
  financialImpact: { label: 'Financial Impact', weight: 0.25, max: 10 },
  feasibility: { label: 'Feasibility', weight: 0.20, max: 10 },
  timeToValue: { label: 'Time to Value', weight: 0.15, max: 10 },
  riskLevel: { label: 'Risk Level (inverse)', weight: 0.15, max: 10 },
};

const initialProjectsData = [
  { id: 1, name: 'Air Separation Unit (ASU) Efficiency Upgrade', stage: 'Execution', health: 'green', pm: 'Sarah Chen', category: 'Production', benefitProjection: 4500000, actualBenefit: 3200000, progress: 72, daysInStage: 12, risk: 'low', lastUpdated: Date.now() },
  { id: 2, name: 'Hydrogen Production Plant Expansion', stage: 'Planning', health: 'yellow', pm: 'Michael Ross', category: 'CapEx', benefitProjection: 12000000, actualBenefit: 1500000, progress: 25, daysInStage: 45, risk: 'medium', lastUpdated: Date.now() },
  { id: 3, name: 'CO2 Capture & Sequestration Initiative', stage: 'Gate Review', health: 'green', pm: 'Emily Watson', category: 'ESG', benefitProjection: 8500000, actualBenefit: 2100000, progress: 40, daysInStage: 8, risk: 'low', lastUpdated: Date.now() },
  { id: 4, name: 'Cryogenic Tank Fleet Modernization', stage: 'Execution', health: 'green', pm: 'David Kim', category: 'Distribution', benefitProjection: 3200000, actualBenefit: 2400000, progress: 78, daysInStage: 18, risk: 'low', lastUpdated: Date.now() },
  { id: 5, name: 'Smart Cylinder Tracking System (IoT)', stage: 'Execution', health: 'green', pm: 'Lisa Park', category: 'Technology', benefitProjection: 1800000, actualBenefit: 1500000, progress: 85, daysInStage: 22, risk: 'low', lastUpdated: Date.now() },
  { id: 6, name: 'Nitrogen Generator On-Site Deployment', stage: 'Planning', health: 'yellow', pm: 'James Miller', category: 'Customer', benefitProjection: 2400000, actualBenefit: 400000, progress: 30, daysInStage: 60, risk: 'high', lastUpdated: Date.now() },
  { id: 7, name: 'Helium Recovery & Recycling Program', stage: 'Gate Review', health: 'red', pm: 'Nina Patel', category: 'Operations', benefitProjection: 5200000, actualBenefit: 0, progress: 15, daysInStage: 90, risk: 'high', lastUpdated: Date.now() },
  { id: 8, name: 'LNG Micro-Bulk Delivery Optimization', stage: 'Execution', health: 'green', pm: 'Robert Chen', category: 'Distribution', benefitProjection: 2100000, actualBenefit: 1700000, progress: 82, daysInStage: 14, risk: 'low', lastUpdated: Date.now() },
  { id: 9, name: 'Medical Oxygen Supply Chain Enhancement', stage: 'Execution', health: 'green', pm: 'Amanda Foster', category: 'Healthcare', benefitProjection: 3800000, actualBenefit: 3100000, progress: 88, daysInStage: 10, risk: 'low', lastUpdated: Date.now() },
  { id: 10, name: 'Green Hydrogen Electrolyzer Pilot', stage: 'Planning', health: 'yellow', pm: 'Thomas Wright', category: 'ESG', benefitProjection: 6500000, actualBenefit: 500000, progress: 20, daysInStage: 35, risk: 'medium', lastUpdated: Date.now() },
  { id: 11, name: 'Argon Purification Process Improvement', stage: 'Closed', health: 'green', pm: 'Sarah Chen', category: 'Production', benefitProjection: 1200000, actualBenefit: 1350000, progress: 100, daysInStage: 0, risk: 'low', lastUpdated: Date.now() },
  { id: 12, name: 'Digital Twin for Plant Operations', stage: 'Execution', health: 'green', pm: 'David Kim', category: 'Technology', benefitProjection: 2800000, actualBenefit: 1900000, progress: 65, daysInStage: 20, risk: 'low', lastUpdated: Date.now() },
];

const initialIdeasData = [
  { id: 1, title: 'Ammonia Cracking for Blue Hydrogen', description: 'Explore ammonia cracking technology', submitter: 'John Miller', votes: 38, status: 'Under Review', category: 'Production', scores: { strategicAlignment: 8, financialImpact: 7, feasibility: 6, timeToValue: 5, riskLevel: 7 } },
  { id: 2, title: 'Predictive Maintenance for Compressors', description: 'AI-driven predictive maintenance', submitter: 'Amy Liu', votes: 45, status: 'Approved', category: 'Operations', scores: { strategicAlignment: 9, financialImpact: 8, feasibility: 8, timeToValue: 7, riskLevel: 8 } },
  { id: 3, title: 'Carbon Footprint Dashboard for Customers', description: 'Real-time emissions tracking', submitter: 'Robert Chen', votes: 31, status: 'Under Review', category: 'ESG', scores: { strategicAlignment: 7, financialImpact: 6, feasibility: 7, timeToValue: 6, riskLevel: 8 } },
  { id: 4, title: 'Specialty Gas Mixing Automation', submitter: 'Nina Patel', votes: 52, status: 'Converting', category: 'Production', scores: { strategicAlignment: 8, financialImpact: 8, feasibility: 7, timeToValue: 7, riskLevel: 7 } },
  { id: 5, title: 'Electric Delivery Fleet Pilot', submitter: 'Marcus Johnson', votes: 29, status: 'Under Review', category: 'Distribution', scores: { strategicAlignment: 6, financialImpact: 7, feasibility: 5, timeToValue: 5, riskLevel: 6 } },
  { id: 6, title: 'Real-time Gas Purity Monitoring (AI)', submitter: 'Lisa Park', votes: 41, status: 'Approved', category: 'Technology', scores: { strategicAlignment: 8, financialImpact: 7, feasibility: 8, timeToValue: 6, riskLevel: 8 } },
];

const benefitsData = [
  { month: 'Mar', forecast: 3800, actual: 3650 }, { month: 'Apr', forecast: 4100, actual: 4200 },
  { month: 'May', forecast: 4400, actual: 4550 }, { month: 'Jun', forecast: 4700, actual: 4800 },
  { month: 'Jul', forecast: 5000, actual: 5150 }, { month: 'Aug', forecast: 5300, actual: 5400 },
  { month: 'Sep', forecast: 5600, actual: 5750 }, { month: 'Oct', forecast: 5900, actual: 6100 },
  { month: 'Nov', forecast: 6200, actual: 6350 }, { month: 'Dec', forecast: 6500, actual: 6700 },
  { month: 'Jan', forecast: 6800, actual: 7000 }, { month: 'Feb', forecast: 7100, actual: 7350 },
];

const generateYearlyData = (year) => {
  const multiplier = year === 2024 ? 1 : year === 2025 ? 1.15 : 1.32;
  return benefitsData.map(d => ({
    ...d,
    forecast: Math.round(d.forecast * multiplier),
    actual: year <= 2025 ? Math.round(d.actual * multiplier) : 0
  }));
};

const categoryData = [
  { name: 'Production', value: 6500, color: '#0ea5e9' }, { name: 'Distribution', value: 5300, color: '#10b981' },
  { name: 'ESG', value: 15000, color: '#8b5cf6' }, { name: 'Technology', value: 4600, color: '#f59e0b' },
  { name: 'Healthcare', value: 3800, color: '#ef4444' }, { name: 'Operations', value: 5200, color: '#06b6d4' },
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

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const HealthDot = ({ health }) => {
  const colors = { green: 'bg-emerald-500 ring-emerald-200', yellow: 'bg-amber-500 ring-amber-200', red: 'bg-red-500 ring-red-200' };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[health]} ring-4`} />;
};

const StatusPill = ({ status }) => {
  const styles = { 
    'Under Review': 'bg-violet-50 text-violet-700', 
    'Approved': 'bg-emerald-50 text-emerald-700', 
    'Converting': 'bg-sky-50 text-sky-700' 
  };
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
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

// CREATE PROJECT MODAL
const CreateProjectModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', category: categories[0], pm: projectManagers[0],
    benefitProjection: '', stage: 'Ideation', health: 'green', risk: 'low',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.benefitProjection) return;
    onSubmit({
      ...formData,
      benefitProjection: parseInt(formData.benefitProjection),
      actualBenefit: 0, progress: 0, daysInStage: 0, lastUpdated: Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Manager *</label>
              <select value={formData.pm} onChange={(e) => setFormData({...formData, pm: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {projectManagers.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Projected Benefits ($) *</label>
              <input type="number" value={formData.benefitProjection} onChange={(e) => setFormData({...formData, benefitProjection: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., 5000000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Initial Stage</label>
              <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                {stages.slice(0, 3).map(stage => <option key={stage} value={stage}>{stage}</option>)}
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

// CREATE IDEA MODAL WITH PRIORITIZATION
const CreateIdeaModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: categories[0], submitter: '',
    scores: { strategicAlignment: 5, financialImpact: 5, feasibility: 5, timeToValue: 5, riskLevel: 5 },
  });

  const priorityScore = calculatePriorityScore(formData.scores);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.submitter.trim()) return;
    onSubmit({ ...formData, votes: 0, status: 'Under Review', priorityScore });
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

// IDEA DETAIL MODAL
const IdeaDetailModal = ({ idea, onClose, onConvert }) => {
  if (!idea) return null;
  const priorityScore = calculatePriorityScore(idea.scores);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between border-b border-amber-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-amber-800/50 text-white px-2 py-0.5 rounded">#I{idea.id}</span>
              <StatusPill status={idea.status} />
            </div>
            <h2 className="text-xl font-bold text-white">{idea.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div><h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3><p className="text-sm text-slate-600">{idea.description || 'No description provided'}</p></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Submitter</p><p className="text-sm font-semibold text-slate-900">{idea.submitter}</p></div>
            <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Category</p><p className="text-sm font-semibold text-slate-900">{idea.category}</p></div>
            <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Votes</p><p className="text-sm font-semibold text-slate-900">{idea.votes}</p></div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Award size={16} className="text-amber-600" />Prioritization Analysis</h3>
              <div className="text-center px-4 py-2 bg-amber-600 text-white rounded-lg"><p className="text-xs">Total Score</p><p className="text-2xl font-bold">{priorityScore}</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {idea.scores && Object.entries(PRIORITIZATION_CRITERIA).map(([key, criterion]) => (
                <div key={key} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">{criterion.label}</span>
                    <span className="text-sm font-bold text-slate-900">{idea.scores[key]}/{criterion.max}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-amber-600 h-2 rounded-full" style={{ width: `${(idea.scores[key] / criterion.max) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Close</button>
            {priorityScore >= 70 && (
              <button onClick={() => { if (confirm(`Convert "${idea.title}" to project?`)) { onConvert(idea); onClose(); }}} className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"><Zap size={16} />Convert to Project</button>
            )}
          </div>
          {priorityScore < 70 && <p className="text-xs text-center text-amber-600">Priority score must be ≥70 to convert</p>}
        </div>
      </div>
    </div>
  );
};

// CASCADE CHART FOR REPORTS
const CascadeChart = ({ data, title }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
        <Bar dataKey="value" fill="#0ea5e9" radius={[4,4,0,0]} />
        <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmbracy, setShowEmbracy] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState(() => getFromStorage(STORAGE_KEYS.AI_MESSAGES, [
    { role: 'assistant', content: "Hello! I'm Embracy, your AI-powered portfolio intelligence assistant.\n\nI can help you analyze project risks, forecast benefits, and provide strategic recommendations for your industrial gas operations.\n\nHow can I assist you today?" }
  ]));
  const [aiInput, setAiInput] = useState('');
  const [projects, setProjects] = useState(() => getFromStorage(STORAGE_KEYS.PROJECTS, initialProjectsData));
  const [ideas, setIdeas] = useState(() => getFromStorage(STORAGE_KEYS.IDEAS, initialIdeasData));
  const [activeUsers, setActiveUsers] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // Modals
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateIdea, setShowCreateIdea] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Persist to localStorage
  useEffect(() => setToStorage(STORAGE_KEYS.PROJECTS, projects), [projects]);
  useEffect(() => setToStorage(STORAGE_KEYS.IDEAS, ideas), [ideas]);
  useEffect(() => setToStorage(STORAGE_KEYS.AI_MESSAGES, aiMessages), [aiMessages]);

  // Simulate active user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(5, Math.min(15, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStageChange = (projectId, direction) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const currentIndex = stages.indexOf(p.stage);
        const newIndex = direction === 'forward' ? Math.min(currentIndex + 1, stages.length - 1) : Math.max(currentIndex - 1, 0);
        return { ...p, stage: stages[newIndex] };
      }
      return p;
    }));
  };

  const handleCreateProject = (newProject) => {
    const id = Math.max(...projects.map(p => p.id), 0) + 1;
    setProjects([...projects, { id, ...newProject }]);
  };

  const handleCreateIdea = (newIdea) => {
    const id = Math.max(...ideas.map(i => i.id), 0) + 1;
    setIdeas([...ideas, { id, ...newIdea }]);
  };

  const convertIdeaToProject = (idea) => {
    const newProject = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      name: idea.title, stage: 'Ideation', health: 'green', pm: 'Unassigned',
      category: idea.category, benefitProjection: 0, actualBenefit: 0, progress: 0,
      daysInStage: 0, risk: 'low', lastUpdated: Date.now()
    };
    setProjects([...projects, newProject]);
    setIdeas(ideas.filter(i => i.id !== idea.id));
  };

  const handleAISubmit = () => {
    if (!aiInput.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', content: aiInput }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const input = aiInput.toLowerCase();
      let response = '';
      const projectMatch = input.match(/project\s*#?\s*(\d+)/i) || input.match(/#p(\d+)/i);
      const ideaMatch = input.match(/idea\s*#?\s*(\d+)/i) || input.match(/#i(\d+)/i);
      
      if (projectMatch) {
        const projectId = parseInt(projectMatch[1] || projectMatch[2]);
        const project = projects.find(p => p.id === projectId);
        if (project) {
          const healthText = { green: '🟢 On Track', yellow: '🟡 At Risk', red: '🔴 Critical' };
          response = `📋 **Project #${project.id}: ${project.name}**\n\n• **Stage:** ${project.stage}\n• **Health:** ${healthText[project.health]}\n• **Progress:** ${project.progress}%\n• **PM:** ${project.pm}\n• **Category:** ${project.category}\n• **Benefit Target:** ${fmt(project.benefitProjection)}\n• **Realized:** ${fmt(project.actualBenefit)}`;
        } else {
          response = `❌ Project #${projectId} not found.`;
        }
      } else if (ideaMatch) {
        const ideaId = parseInt(ideaMatch[1] || ideaMatch[2]);
        const idea = ideas.find(i => i.id === ideaId);
        if (idea) {
          response = `💡 **Idea #${idea.id}: ${idea.title}**\n\n• **Status:** ${idea.status}\n• **Votes:** ${idea.votes}\n• **Score:** ${calculatePriorityScore(idea.scores)}\n• **Submitter:** ${idea.submitter}\n• **Category:** ${idea.category}`;
        } else {
          response = `❌ Idea #${ideaId} not found.`;
        }
      } else if (input.includes('risk')) {
        response = "📊 **Portfolio Risk Analysis**\n\n**Critical:**\n• P#7 Helium Recovery — Red status\n\n**Elevated:**\n• P#2 H2 Plant Expansion — Yellow\n• P#6 Nitrogen Generator — Yellow";
      } else if (input.includes('benefit')) {
        response = "📈 **Benefit Summary**\n\n• YTD Realized: $19.7M\n• Forecast: $54.0M\n• Top Performers: P#9, P#5, P#4";
      } else if (input.includes('list project')) {
        response = "📋 **All Projects:**\n\n" + projects.map(p => `• P#${p.id} ${p.name} — ${p.stage}`).join('\n');
      } else if (input.includes('list idea')) {
        response = "💡 **All Ideas:**\n\n" + ideas.map(i => `• I#${i.id} ${i.title} — ${i.votes} votes`).join('\n');
      } else {
        response = "I can help with:\n\n• Project Status — 'Project #1'\n• Idea Status — 'Idea #2'\n• Risk Analysis — 'Portfolio risks'\n• Benefits — 'Benefit summary'\n• List all — 'List projects'";
      }
      
      setIsTyping(false);
      setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1200);
    setAiInput('');
  };

  const benefitsChartData = useMemo(() => generateYearlyData(selectedYear), [selectedYear]);
  
  const scorecardData = [
    { name: 'Target', value: 80000, cumulative: 80000 },
    { name: 'Production', value: 6500, cumulative: 86500 },
    { name: 'Distribution', value: 5300, cumulative: 91800 },
    { name: 'ESG', value: 15000, cumulative: 106800 },
    { name: 'Technology', value: 4600, cumulative: 111400 },
    { name: 'Healthcare', value: 3800, cumulative: 115200 },
    { name: 'Operations', value: 5200, cumulative: 120400 },
    { name: 'Actual', value: 0, cumulative: 120400 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* BEAUTIFUL ORIGINAL SIDEBAR */}
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
          <NavItem icon={FolderKanban} label="Projects" view="projects" badge="12" activeView={activeView} onClick={() => setActiveView('projects')} />
          <NavItem icon={Lightbulb} label="Ideas Pipeline" view="ideas" badge={ideas.length} activeView={activeView} onClick={() => setActiveView('ideas')} />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Analytics</p>
          <NavItem icon={TrendingUp} label="Benefits Tracker" view="benefits" activeView={activeView} onClick={() => setActiveView('benefits')} />
          <NavItem icon={Circle} label="Reports" view="reports" activeView={activeView} onClick={() => setActiveView('reports')} />
          <NavItem icon={Database} label="Data" view="data" activeView={activeView} onClick={() => setActiveView('data')} />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Intelligence</p>
          <NavItem icon={Cpu} label="AI Agent Embracy" view="embracy" activeView={activeView} onClick={() => setActiveView('embracy')} />
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
            <input type="text" placeholder="Search projects, PMs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="relative"><Users size={16} className="text-slate-600" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /></div>
              <div className="flex flex-col"><span className="text-xs font-semibold text-slate-900">{activeUsers}</span><span className="text-[10px] text-slate-500 leading-none">active</span></div>
            </div>
            <button onClick={() => setShowEmbracy(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all text-sm font-medium"><Sparkles size={16} />Ask Embracy</button>
            <button className="p-2 hover:bg-slate-100 rounded-lg relative"><Bell size={18} className="text-slate-500" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Dashboard */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Portfolio Dashboard</h1><p className="text-slate-500 text-sm mt-1">Real-time overview of your industrial gas portfolio</p></div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCreateProject(true)} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-2"><Plus size={16} />New Project</button>
                  <button onClick={() => setShowCreateIdea(true)} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 flex items-center gap-2"><Lightbulb size={16} />New Idea</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <StatCard icon={FolderKanban} label="Active Projects" value="12" change="8%" up sub="2 in gate review" />
                <StatCard icon={DollarSign} label="YTD Benefits" value="$19.7M" change="6.5%" up sub="vs $18.5M forecast" />
                <StatCard icon={Target} label="On Track Rate" value="83%" change="2%" sub="10 of 12 projects" />
                <StatCard icon={Lightbulb} label="Ideas Pipeline" value={ideas.length} change="15%" up sub={`Avg score: ${Math.round(ideas.reduce((sum, i) => sum + calculatePriorityScore(i.scores), 0) / ideas.length)}`} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="font-semibold text-slate-900">Benefits Tracking - {selectedYear}</h3><p className="text-xs text-slate-500">Forecast vs Actual ($K)</p></div>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="px-3 py-1 border border-slate-200 rounded-lg text-xs">
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={benefitsChartData}>
                      <defs><linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
                      <Area type="monotone" dataKey="forecast" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} fill="url(#actualG)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">Benefits by Category</h3>
                  <p className="text-xs text-slate-500 mb-3">Portfolio allocation</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">{categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1 mt-2">{categoryData.map((c, i) => <div key={i} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}/><span className="text-xs text-slate-600 truncate">{c.name}</span></div>)}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Active Projects</h3>
                  <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">View All →</button>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50"><tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stage</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Health</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Benefit</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Progress</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.slice(0, 6).map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><span className="inline-flex items-center gap-0.5 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"><Hash size={10}/>P{p.id}</span><div><p className="font-medium text-slate-900 text-sm">{p.name}</p><p className="text-xs text-slate-500">{p.pm} · {p.category}</p></div></div></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-2">
                          <button onClick={() => handleStageChange(p.id, 'back')} className="p-1 rounded hover:bg-slate-200"><ArrowLeft size={12} className="text-slate-400" /></button>
                          <span className="text-sm text-slate-700 font-medium w-20">{p.stage}</span>
                          <button onClick={() => handleStageChange(p.id, 'forward')} className="p-1 rounded hover:bg-slate-200"><ArrowRight size={12} className="text-slate-400" /></button>
                        </div></td>
                        <td className="px-5 py-4"><HealthDot health={p.health} /></td>
                        <td className="px-5 py-4"><span className="font-semibold text-slate-900 text-sm">{fmt(p.benefitProjection)}</span></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-20 bg-slate-200 rounded-full h-1.5"><div className="bg-sky-500 h-1.5 rounded-full" style={{width: `${p.progress}%`}}/></div><span className="text-xs text-slate-500">{p.progress}%</span></div></td>
                        <td className="px-5 py-4"><button className="p-1.5 rounded-lg hover:bg-slate-100"><MoreHorizontal size={16} className="text-slate-400" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Projects Kanban */}
          {activeView === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Projects</h1><p className="text-slate-500 text-sm mt-1">Manage and track project stages</p></div>
                <button onClick={() => setShowCreateProject(true)} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-2"><Plus size={16} />New Project</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {stages.slice(0, 5).map(stage => (
                  <div key={stage} className="flex-shrink-0 w-72">
                    <div className="bg-slate-100 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-semibold text-slate-700 text-sm">{stage}</h3>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-500 font-medium">{projects.filter(p => p.stage === stage).length}</span>
                      </div>
                      <div className="space-y-2">
                        {projects.filter(p => p.stage === stage).map(p => (
                          <div key={p.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="inline-flex items-center gap-0.5 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 mb-1"><Hash size={10}/>P{p.id}</span>
                                <h4 className="font-medium text-slate-900 text-sm leading-snug pr-2">{p.name}</h4>
                              </div>
                              <HealthDot health={p.health} />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.category}</span>
                              <span className="text-xs text-slate-500">{fmt(p.benefitProjection)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-xs">{p.pm.split(' ').map(n => n[0]).join('')}</div>
                                <span className="text-xs text-slate-500">{p.pm.split(' ')[0]}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleStageChange(p.id, 'back')} className="p-1 rounded hover:bg-slate-100"><ArrowLeft size={12} className="text-slate-400" /></button>
                                <button onClick={() => handleStageChange(p.id, 'forward')} className="p-1 rounded hover:bg-slate-100"><ArrowRight size={12} className="text-slate-400" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ideas */}
          {activeView === 'ideas' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-semibold text-slate-900">Ideas Pipeline</h1><p className="text-slate-500 text-sm mt-1">Evaluate and convert ideas into projects</p></div>
                <button onClick={() => setShowCreateIdea(true)} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 flex items-center gap-2"><Plus size={16} />Submit Idea</button>
              </div>
              <div className="space-y-3">
                {ideas.sort((a, b) => calculatePriorityScore(b.scores) - calculatePriorityScore(a.scores)).map(idea => {
                  const score = calculatePriorityScore(idea.scores);
                  return (
                    <div key={idea.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedIdea(idea)}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center gap-1 text-sm font-mono bg-amber-50 px-2 py-0.5 rounded text-amber-700"><Hash size={12}/>I{idea.id}</span>
                            <h3 className="font-semibold text-slate-900">{idea.title}</h3>
                            <StatusPill status={idea.status} />
                            <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded"><Star size={12} className="text-amber-600" /><span className="text-xs font-bold text-amber-700">{score}</span></div>
                          </div>
                          <p className="text-sm text-slate-500">By {idea.submitter} · {idea.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center px-4"><p className="text-2xl font-semibold text-slate-900">{idea.votes}</p><p className="text-xs text-slate-500">votes</p></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits */}
          {activeView === 'benefits' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div><h1 className="text-2xl font-semibold text-slate-900">Benefits Tracker</h1><p className="text-slate-500 text-sm mt-1">12-month rolling actuals and 3-year forecast</p></div>
              <div className="grid grid-cols-4 gap-4">
                <StatCard icon={TrendingUp} label="12-Month Actual" value="$19.7M" change="6.5%" up sub="vs $18.5M forecast" />
                <StatCard icon={Target} label="Year 1 Projection" value="$54.0M" />
                <StatCard icon={Target} label="Year 2 Projection" value="$78.5M" />
                <StatCard icon={Target} label="Year 3 Projection" value="$112.0M" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-4">3-Year Benefit Trajectory ($M)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{y:'Y1Q1',a:12.4,f:11.8},{y:'Y1Q2',a:13.8,f:13.2},{y:'Y1Q3',a:14.2,f:14},{y:'Y1Q4',a:13.6,f:15},{y:'Y2Q1',f:17.5},{y:'Y2Q2',f:19.2},{y:'Y2Q3',f:20.8},{y:'Y2Q4',f:21},{y:'Y3Q1',f:25.5},{y:'Y3Q2',f:27},{y:'Y3Q3',f:29},{y:'Y3Q4',f:30.5}]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="y" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor:'#1e293b',border:'none',borderRadius:'8px',fontSize:'12px',color:'white'}} />
                    <Bar dataKey="a" fill="#0ea5e9" radius={[4,4,0,0]} name="Actual" />
                    <Bar dataKey="f" fill="#e2e8f0" radius={[4,4,0,0]} name="Forecast" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Reports with Cascade Chart */}
          {activeView === 'reports' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div><h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1><p className="text-slate-500 text-sm mt-1">Portfolio scorecard and performance metrics</p></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center"><CheckCircle size={20} className="text-white" /></div><div><p className="text-xs text-slate-600">On-Time Delivery</p><p className="text-2xl font-bold text-slate-900">87%</p></div></div></div>
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center"><DollarSign size={20} className="text-white" /></div><div><p className="text-xs text-slate-600">ROI Average</p><p className="text-2xl font-bold text-slate-900">24%</p></div></div></div>
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center"><Users size={20} className="text-white" /></div><div><p className="text-xs text-slate-600">Resource Utilization</p><p className="text-2xl font-bold text-slate-900">92%</p></div></div></div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div><div><p className="text-xs text-slate-600">Portfolio Growth</p><p className="text-2xl font-bold text-slate-900">+15%</p></div></div></div>
              </div>
              <CascadeChart data={scorecardData} title="Portfolio Value Cascade - 2025 Performance" />
            </div>
          )}

          {/* AI Agent Embracy */}
          {activeView === 'embracy' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-200"><Cpu size={32} className="text-white" /></div>
                <h1 className="text-2xl font-semibold text-slate-900">AI Agent Embracy</h1>
                <p className="text-slate-500 text-sm mt-1">Your intelligent portfolio assistant powered by AI</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{height:'520px'}}>
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"><Cpu size={16} className="text-white" /></div>}
                        <div className={`max-w-2xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}><p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p></div>
                      </div>
                    ))}
                    {isTyping && <div className="flex justify-start"><div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-3"><Cpu size={16} className="text-white" /></div><div className="bg-slate-100 px-4 py-3 rounded-2xl"><div className="flex gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"/><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div></div></div>}
                  </div>
                  <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex gap-3">
                      <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()} placeholder="Ask Embracy about your portfolio..." className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                      <button onClick={handleAISubmit} className="px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"><Send size={18} /></button>
                    </div>
                    <div className="flex gap-2 mt-3">{['Project #7 status','Idea #4 status','List all projects','Portfolio risks'].map((q,i) => <button key={i} onClick={() => setAiInput(q)} className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">{q}</button>)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data */}
          {activeView === 'data' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div><h1 className="text-2xl font-semibold text-slate-900">Data</h1><p className="text-slate-500 text-sm mt-1">Complete listing of all projects and ideas</p></div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50"><h3 className="font-semibold text-slate-900 flex items-center gap-2"><FolderKanban size={18} /> Projects ({projects.length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100"><tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stage</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">PM</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Benefit Target</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Realized</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Progress</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700"><Hash size={12}/>P{p.id}</span></td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{p.stage}</td>
                          <td className="px-4 py-3"><HealthDot health={p.health} /></td>
                          <td className="px-4 py-3 text-sm text-slate-600">{p.pm}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{p.category}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{fmt(p.benefitProjection)}</td>
                          <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{fmt(p.actualBenefit)}</td>
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-slate-200 rounded-full h-1.5"><div className="bg-sky-500 h-1.5 rounded-full" style={{width:`${p.progress}%`}}/></div><span className="text-xs text-slate-500">{p.progress}%</span></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50"><h3 className="font-semibold text-slate-900 flex items-center gap-2"><Lightbulb size={18} /> Ideas ({ideas.length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100"><tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Idea Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Submitter</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Votes</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {ideas.map(i => (
                        <tr key={i.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm font-mono bg-amber-50 px-2 py-0.5 rounded text-amber-700"><Hash size={12}/>I{i.id}</span></td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{i.title}</td>
                          <td className="px-4 py-3"><StatusPill status={i.status} /></td>
                          <td className="px-4 py-3"><span className="text-sm font-bold text-amber-600">{calculatePriorityScore(i.scores)}</span></td>
                          <td className="px-4 py-3 text-sm text-slate-600">{i.submitter}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{i.category}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{i.votes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeView === 'settings' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center"><Settings size={48} className="mx-auto text-slate-300 mb-4" /><h3 className="text-xl font-semibold text-slate-800">Settings</h3><p className="text-slate-500 mt-2">Configure your preferences</p></div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Embracy */}
      {showEmbracy && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white"><Cpu size={18} /><span className="font-semibold text-sm">Embracy</span></div>
            <button onClick={() => setShowEmbracy(false)} className="text-white/80 hover:text-white p-1"><X size={18} /></button>
          </div>
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-xl text-xs ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}><p className="whitespace-pre-line leading-relaxed">{msg.content}</p></div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="bg-slate-100 px-3 py-2 rounded-xl"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"/><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div></div></div>}
          </div>
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()} placeholder="Ask Embracy..." className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <button onClick={handleAISubmit} className="px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"><Send size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} onSubmit={handleCreateProject} />}
      {showCreateIdea && <CreateIdeaModal onClose={() => setShowCreateIdea(false)} onSubmit={handleCreateIdea} />}
      {selectedIdea && <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} onConvert={convertIdeaToProject} />}
    </div>
  );
}
