import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { categories, IDEA_STATUSES, PRIORITIZATION_CRITERIA } from '../../utils/constants';
import { validateIdea } from '../../utils/validation';
import { calculatePriorityScore } from '../../utils/calculations';

/**
 * Edit Idea Modal Component
 * @param {Object} props - Component props
 * @param {Object} props.idea - Idea to edit
 * @param {Array} props.portfolios - Available portfolios
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 */
const EditIdeaModal = ({ idea, portfolios, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submitter: '',
    category: categories[0],
    portfolioId: portfolios[0]?.id || null,
    status: IDEA_STATUSES[0],
    votes: 0,
    scores: {
      strategicAlignment: 5,
      financialImpact: 5,
      feasibility: 5,
      timeToValue: 5,
      riskLevel: 5,
    },
  });

  const [errors, setErrors] = useState({});
  const [priorityScore, setPriorityScore] = useState(0);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        submitter: idea.submitter || '',
        category: idea.category || categories[0],
        portfolioId: idea.portfolioId || portfolios[0]?.id || null,
        status: idea.status || IDEA_STATUSES[0],
        votes: idea.votes || 0,
        scores: idea.scores || {
          strategicAlignment: 5,
          financialImpact: 5,
          feasibility: 5,
          timeToValue: 5,
          riskLevel: 5,
        },
      });
    }
  }, [idea, portfolios]);

  useEffect(() => {
    setPriorityScore(calculatePriorityScore(formData.scores));
  }, [formData.scores]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateIdea(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const updatedIdea = {
      ...idea,
      ...formData,
      votes: parseInt(formData.votes) || 0,
    };

    onSubmit(updatedIdea);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleScoreChange = (criterion, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [criterion]: Math.min(10, Math.max(0, numValue))
      }
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-idea-title"
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-700 px-6 py-4 flex items-center justify-between">
          <h2 id="edit-idea-title" className="text-xl font-bold text-white flex items-center gap-2">
            <Save size={20} />
            Edit Idea
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="idea-title">
              Idea Title *
            </label>
            <input
              id="idea-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.title ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter idea title"
              required
              aria-required="true"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="idea-description">
              Description *
            </label>
            <textarea
              id="idea-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.description ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Describe your idea..."
              rows="4"
              required
              aria-required="true"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          {/* Submitter, Category, Portfolio */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="submitter">
                Submitter *
              </label>
              <input
                id="submitter"
                type="text"
                value={formData.submitter}
                onChange={(e) => handleChange('submitter', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="idea-category">
                Category *
              </label>
              <select
                id="idea-category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-required="true"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="idea-portfolio">
                Portfolio
              </label>
              <select
                id="idea-portfolio"
                value={formData.portfolioId || ''}
                onChange={(e) => handleChange('portfolioId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">No Portfolio</option>
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Votes */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="idea-status">
                Status
              </label>
              <select
                id="idea-status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {IDEA_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="votes">
                Votes
              </label>
              <input
                id="votes"
                type="number"
                value={formData.votes}
                onChange={(e) => handleChange('votes', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>

          {/* Prioritization Scores */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-700">Prioritization Criteria</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{priorityScore}</div>
                <div className="text-xs text-slate-500">Priority Score</div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 rounded-lg p-4">
              {Object.entries(PRIORITIZATION_CRITERIA).map(([key, criterion]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700" htmlFor={key}>
                      {criterion.label}
                      <span className="text-xs text-slate-500 ml-1">
                        (Weight: {(criterion.weight * 100).toFixed(0)}%)
                      </span>
                    </label>
                    <span className="text-sm font-semibold text-slate-900">
                      {formData.scores[key]}/10
                    </span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min="0"
                    max="10"
                    value={formData.scores[key]}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    aria-label={criterion.label}
                    aria-valuemin="0"
                    aria-valuemax="10"
                    aria-valuenow={formData.scores[key]}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIdeaModal;
