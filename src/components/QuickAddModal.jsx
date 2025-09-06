import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';

const QuickAddModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobLink: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (formData.jobLink && !isValidUrl(formData.jobLink)) {
      newErrors.jobLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        jobTitle: formData.jobTitle,
        company: formData.company,
        location: '',
        jobLink: formData.jobLink,
        applicationDate: '',
        status: 'wishlist',
        followUpDate: '',
        notes: ''
      });

      // Reset form and close modal
      setFormData({
        jobTitle: '',
        company: '',
        jobLink: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save job. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      jobTitle: '',
      company: '',
      jobLink: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl shadow-tier-3 w-full max-w-md animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Save for Later</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Quickly save a job opportunity to your wishlist
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-text-secondary" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                error={errors.jobTitle}
                required
                autoFocus
              />

              <Input
                label="Company"
                type="text"
                placeholder="e.g. Google Inc."
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                error={errors.company}
                required
              />

              <Input
                label="Job Link"
                type="url"
                placeholder="https://company.com/careers/job-id (optional)"
                value={formData.jobLink}
                onChange={(e) => handleInputChange('jobLink', e.target.value)}
                error={errors.jobLink}
              />

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-error/5 border border-error/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <span className="text-sm text-error">{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1"
                  isLoading={isLoading}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Save Job
                </Button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
