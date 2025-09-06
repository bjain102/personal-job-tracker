import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessMessage = ({ 
  isVisible = false, 
  jobTitle = '', 
  company = '', 
  isEditing = false,
  onViewJob = () => {},
  onAddAnother = () => {},
  onClose = () => {},
  autoCloseDelay = 5000
}) => {
  const [countdown, setCountdown] = useState(Math.floor(autoCloseDelay / 1000));

  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-tier-3 max-w-md w-full animate-slide-up">
        {/* Success Header */}
        <div className="p-6 text-center border-b border-border">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {isEditing ? 'Job Updated Successfully!' : 'Job Added Successfully!'}
          </h3>
          
          <div className="space-y-1">
            <p className="text-lg font-medium text-text-primary">
              {jobTitle}
            </p>
            <p className="text-sm text-text-secondary">
              at {company}
            </p>
          </div>
        </div>

        {/* Success Details */}
        <div className="p-6 space-y-4">
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-text-primary font-medium mb-1">
                  {isEditing ? 'Changes Saved' : 'Application Tracked'}
                </p>
                <p className="text-xs text-text-secondary">
                  {isEditing 
                    ? 'Your job application details have been updated and synced across all views.' :'Your new job application is now being tracked and will appear in both table and kanban views.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold text-text-primary">
                {new Date()?.toLocaleDateString()}
              </div>
              <div className="text-xs text-text-secondary">
                {isEditing ? 'Updated' : 'Added'}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold text-text-primary">
                <Icon name="Target" size={16} className="inline mr-1" />
                Active
              </div>
              <div className="text-xs text-text-secondary">
                Status
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={onViewJob}
              fullWidth
            >
              View Job
            </Button>
            
            {!isEditing && (
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={onAddAnother}
                fullWidth
              >
                Add Another
              </Button>
            )}
            
            {isEditing && (
              <Button
                variant="default"
                size="sm"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={onClose}
                fullWidth
              >
                Back to Dashboard
              </Button>
            )}
          </div>

          {/* Auto-close indicator */}
          {autoCloseDelay > 0 && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Icon name="Clock" size={12} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">
                Auto-closing in {countdown} seconds
              </span>
              <button
                onClick={onClose}
                className="text-xs text-primary hover:text-primary/80 underline"
              >
                Close now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;