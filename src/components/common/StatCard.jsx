import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Statistics card component for dashboard
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.label - Card label
 * @param {string|number} props.value - Main value to display
 * @param {string} props.change - Change percentage (optional)
 * @param {boolean} props.up - Whether change is positive (optional)
 * @param {string} props.sub - Subtitle text (optional)
 */
const StatCard = ({ icon: Icon, label, value, change, up, sub }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon size={20} className="text-slate-600" aria-hidden="true" />
      </div>
      {change && (
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${
            up ? 'text-emerald-600' : 'text-red-500'
          }`}
          role="status"
          aria-label={`${up ? 'Increased' : 'Decreased'} by ${change}`}
        >
          {up ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

export default StatCard;
