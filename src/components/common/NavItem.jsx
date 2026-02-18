/**
 * Navigation item component for sidebar
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.label - Navigation label
 * @param {string} props.view - View identifier
 * @param {number} props.badge - Badge count (optional)
 * @param {string} props.activeView - Currently active view
 * @param {Function} props.onClick - Click handler
 */
const NavItem = ({ icon: Icon, label, view, badge, activeView, onClick }) => {
  const isActive = activeView === view;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
        ${isActive
          ? 'bg-slate-800 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Navigate to ${label}`}
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <span className="font-medium text-sm flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="px-1.5 py-0.5 text-xs bg-sky-500 text-white rounded-full"
          aria-label={`${badge} items`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export default NavItem;
