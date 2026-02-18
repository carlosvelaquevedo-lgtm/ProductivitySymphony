import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { categories, projectManagers, PROJECT_STATUSES, FINANCE_APPROVAL_STATUSES, RISK_LEVELS, HEALTH_STATUSES } from '../../utils/constants';
import { validateProject } from '../../utils/validation';

/**
 * Edit Project Modal Component
 * @param {Object} props - Component props
 * @param {Object} props.project - Project to edit
 * @param {Array} props.portfolios - Available portfolios
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 */
const EditProjectModal = ({ project, portfolios, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    pm: projectManagers[0],
    benefitProjection: '',
    actualBenefit: '',
    projectStatus: PROJECT_STATUSES[0],
    financeApproval: FINANCE_APPROVAL_STATUSES[0],
    health: 'green',
    risk: 'low',
    progress: 0,
    portfolioId: portfolios[0]?.id || null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        category: project.category || categories[0],
        pm: project.pm || projectManagers[0],
        benefitProjection: project.benefitProjection || '',
        actualBenefit: project.actualBenefit || 0,
        projectStatus: project.projectStatus || PROJECT_STATUSES[0],
        financeApproval: project.financeApproval || FINANCE_APPROVAL_STATUSES[0],
        health: project.health || 'green',
        risk: project.risk || 'low',
        progress: project.progress || 0,
        portfolioId: project.portfolioId || portfolios[0]?.id || null,
      });
    }
  }, [project, portfolios]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateProject(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const updatedProject = {
      ...project,
      ...formData,
      benefitProjection: parseInt(formData.benefitProjection),
      actualBenefit: parseInt(formData.actualBenefit) || 0,
      progress: parseInt(formData.progress) || 0,
    };

    onSubmit(updatedProject);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <h2 id="edit-project-title" className="text-xl font-bold text-white flex items-center gap-2">
            <Save size={20} />
            Edit Project
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
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="project-name">
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter project name"
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Category and Portfolio */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="project-category">
                Category *
              </label>
              <select
                id="project-category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="project-portfolio">
                Portfolio *
              </label>
              <select
                id="project-portfolio"
                value={formData.portfolioId}
                onChange={(e) => handleChange('portfolioId', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              >
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Manager */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="project-pm">
              Project Manager *
            </label>
            <select
              id="project-pm"
              value={formData.pm}
              onChange={(e) => handleChange('pm', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
              {projectManagers.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="benefit-projection">
                Benefit Projection ($) *
              </label>
              <input
                id="benefit-projection"
                type="number"
                value={formData.benefitProjection}
                onChange={(e) => handleChange('benefitProjection', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.benefitProjection ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="e.g., 5000000"
                required
                min="0"
                aria-required="true"
                aria-invalid={!!errors.benefitProjection}
              />
              {errors.benefitProjection && (
                <p className="text-red-600 text-sm mt-1" role="alert">
                  {errors.benefitProjection}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="actual-benefit">
                Actual Benefit ($)
              </label>
              <input
                id="actual-benefit"
                type="number"
                value={formData.actualBenefit}
                onChange={(e) => handleChange('actualBenefit', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3200000"
                min="0"
              />
            </div>
          </div>

          {/* Status Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="project-status">
                Project Status
              </label>
              <select
                id="project-status"
                value={formData.projectStatus}
                onChange={(e) => handleChange('projectStatus', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROJECT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="finance-approval">
                Finance Approval
              </label>
              <select
                id="finance-approval"
                value={formData.financeApproval}
                onChange={(e) => handleChange('financeApproval', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FINANCE_APPROVAL_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Health, Risk, Progress */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="health">
                Health Status
              </label>
              <select
                id="health"
                value={formData.health}
                onChange={(e) => handleChange('health', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {HEALTH_STATUSES.map(h => (
                  <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="risk">
                Risk Level
              </label>
              <select
                id="risk"
                value={formData.risk}
                onChange={(e) => handleChange('risk', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {RISK_LEVELS.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="progress">
                Progress (%)
              </label>
              <input
                id="progress"
                type="number"
                value={formData.progress}
                onChange={(e) => handleChange('progress', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                placeholder="0-100"
              />
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
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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

export default EditProjectModal;
