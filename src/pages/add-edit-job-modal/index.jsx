import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ModalNavigation from '../../components/ui/ModalNavigation';
import JobFormFields from './components/JobFormFields';
import FormValidation from './components/FormValidation';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import SuccessMessage from './components/SuccessMessage';
import Icon from '../../components/AppIcon';
import { jobsService } from '../../lib/jobsService';


const AddEditJobModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jobId = searchParams?.get('id');
  const jobFromState = location.state?.job;
  const isEditing = Boolean(jobId) || Boolean(jobFromState);

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobLink: '',
    applicationDate: '',
    status: 'wishlist',
    followUpDate: '',
    notes: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Load job data for editing
  useEffect(() => {
    const loadJobData = async () => {
      if (isEditing) {
        try {
          let jobData;
          
          // If job data is passed via state (from dashboard)
          if (jobFromState) {
            jobData = {
              jobTitle: jobFromState.title,
              company: jobFromState.company,
              location: jobFromState.location || '',
              jobLink: jobFromState.jobLink || '',
              applicationDate: jobFromState.applicationDate || '',
              status: jobFromState.status || 'wishlist',
              followUpDate: jobFromState.followUpDate || '',
              notes: jobFromState.notes || ''
            };
          }
          // If job ID is provided, fetch from Supabase
          else if (jobId) {
            const job = await jobsService.getJobById(jobId);
            jobData = {
              jobTitle: job.job_title,
              company: job.company,
              location: job.location || '',
              jobLink: job.job_link || '',
              applicationDate: job.application_date || '',
              status: job.status?.toLowerCase() || 'wishlist',
              followUpDate: job.follow_up_date || '',
              notes: job.notes || ''
            };
          }
          
          if (jobData) {
            setFormData(jobData);
            setOriginalData(jobData);
          }
        } catch (error) {
          console.error('Failed to load job data:', error);
        }
      }
    };

    loadJobData();
  }, [isEditing, jobId, jobFromState]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && !isLoading) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 3000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData, hasUnsavedChanges, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey && e?.key === 's') {
        e?.preventDefault();
        handleSave();
      }
      if (e?.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.jobTitle?.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData?.company?.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (formData?.jobLink && !isValidUrl(formData?.jobLink)) {
      newErrors.jobLink = 'Please enter a valid URL';
    }

    if (formData?.applicationDate && new Date(formData.applicationDate) > new Date()) {
      newErrors.applicationDate = 'Application date cannot be in the future';
    }

    if (formData?.followUpDate && formData?.applicationDate && 
        new Date(formData.followUpDate) < new Date(formData.applicationDate)) {
      newErrors.followUpDate = 'Follow-up date must be after application date';
    }

    if (formData?.notes?.length > 1000) {
      newErrors.notes = 'Notes cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAutoSave = async () => {
    if (!validateForm() || !hasUnsavedChanges || !isEditing) return;

    setIsAutoSaving(true);
    
    try {
      const jobIdToUpdate = jobFromState?.id || jobId;
      if (jobIdToUpdate) {
        await jobsService.updateJob(jobIdToUpdate, formData);
        setLastSaved(new Date());
        setOriginalData({ ...formData });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing) {
        // Update existing job
        const jobIdToUpdate = jobFromState?.id || jobId;
        await jobsService.updateJob(jobIdToUpdate, formData);
      } else {
        // Create new job
        await jobsService.addJob(formData);
      }

      // Update original data to prevent unsaved changes warning
      setOriginalData({ ...formData });
      setHasUnsavedChanges(false);
      setLastSaved(new Date());

      // Show success message
      setShowSuccess(true);

    } catch (error) {
      console.error('Error saving job:', error);
      setErrors({ submit: 'Failed to save job. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      );
      if (!confirmClose) return;
    }
    navigate('/job-dashboard-table-kanban-views');
  };

  const handleCancel = () => {
    handleClose();
  };

  const handlePreviewLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSuccessViewJob = () => {
    setShowSuccess(false);
    navigate('/job-dashboard-table-kanban-views');
  };

  const handleSuccessAddAnother = () => {
    setShowSuccess(false);
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      jobLink: '',
      applicationDate: '',
      status: 'wishlist',
      followUpDate: '',
      notes: ''
    });
    setOriginalData({});
    setErrors({});
    setHasUnsavedChanges(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/job-dashboard-table-kanban-views');
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in">
        {/* Modal Container */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-xl shadow-tier-3 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
              
              {/* Modal Navigation */}
              <ModalNavigation
                title={isEditing ? 'Edit Job Application' : 'Add New Job'}
                subtitle={isEditing ? `Editing: ${formData?.jobTitle} at ${formData?.company}` : 'Track a new job opportunity'}
                onClose={handleClose}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isLoading}
                hasUnsavedChanges={hasUnsavedChanges}
                saveButtonText={isEditing ? 'Update Job' : 'Save Job'}
              />

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-6 space-y-6">
                  
                  {/* Auto-save Indicator */}
                  <AutoSaveIndicator
                    isAutoSaving={isAutoSaving}
                    lastSaved={lastSaved}
                    hasUnsavedChanges={hasUnsavedChanges}
                    autoSaveEnabled={true}
                  />

                  {/* Form Fields */}
                  <JobFormFields
                    formData={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    isEditing={isEditing}
                    onPreviewLink={handlePreviewLink}
                  />

                  {/* Form Validation */}
                  <FormValidation
                    errors={errors}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isValid={Object.keys(errors)?.length === 0}
                  />

                  {/* Submit Error */}
                  {errors?.submit && (
                    <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="AlertCircle" size={16} className="text-error" />
                        <span className="text-sm text-error font-medium">
                          {errors?.submit}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* Success Message */}
      <SuccessMessage
        isVisible={showSuccess}
        jobTitle={formData?.jobTitle}
        company={formData?.company}
        isEditing={isEditing}
        onViewJob={handleSuccessViewJob}
        onAddAnother={handleSuccessAddAnother}
        onClose={handleSuccessClose}
        autoCloseDelay={5000}
      />
    </>
  );
};

export default AddEditJobModal;