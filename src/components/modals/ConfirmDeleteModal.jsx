import { AlertTriangle, X, Trash2 } from 'lucide-react';

/**
 * Confirm Delete Modal Component
 * @param {Object} props - Component props
 * @param {string} props.title - Item title to delete
 * @param {string} props.type - Type of item (project, idea, portfolio)
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm delete handler
 */
const ConfirmDeleteModal = ({ title, type = 'item', onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 id="delete-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle size={20} />
            Confirm Delete
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-800 font-medium">
                This action cannot be undone.
              </p>
              <p className="text-xs text-red-700 mt-1">
                All associated data will be permanently deleted.
              </p>
            </div>
          </div>

          <div>
            <p className="text-slate-700">
              Are you sure you want to delete this {type}?
            </p>
            <div className="mt-2 p-3 bg-slate-100 rounded-lg">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
