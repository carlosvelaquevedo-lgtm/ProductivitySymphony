/**
 * Status pill badge component
 * @param {Object} props - Component props
 * @param {string} props.status - Status text
 * @param {string} props.type - Status type (idea, project, finance)
 */
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
  const className = styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${className}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
