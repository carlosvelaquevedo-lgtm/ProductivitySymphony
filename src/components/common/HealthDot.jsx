/**
 * Health status indicator component
 * @param {Object} props - Component props
 * @param {string} props.health - Health status (green, yellow, red)
 */
const HealthDot = ({ health }) => {
  const colors = {
    green: 'bg-emerald-500 ring-emerald-200',
    yellow: 'bg-amber-500 ring-amber-200',
    red: 'bg-red-500 ring-red-200'
  };

  const labels = {
    green: 'Healthy',
    yellow: 'At Risk',
    red: 'Critical'
  };

  return (
    <div
      className={`w-2.5 h-2.5 rounded-full ${colors[health] || colors.green} ring-4`}
      role="status"
      aria-label={labels[health] || labels.green}
      title={labels[health] || labels.green}
    />
  );
};

export default HealthDot;
