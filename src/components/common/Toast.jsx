import { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast notification component for user feedback
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, info, warning)
 * @param {number} props.duration - Duration in ms before auto-dismiss
 * @param {Function} props.onClose - Callback when toast is closed
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  if (!isVisible) return null;

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-600'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-600'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md
        ${config.bg} ${config.border} ${config.text}
        transition-all duration-300 transform
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} className={`flex-shrink-0 ${config.iconColor} mt-0.5`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * Toast container component to manage multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3 pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toast;
