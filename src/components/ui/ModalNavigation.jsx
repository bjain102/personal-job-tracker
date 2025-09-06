import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ModalNavigation = ({ 
  title = 'Add New Job',
  subtitle = '',
  onClose = () => {},
  onSave = () => {},
  onCancel = () => {},
  currentStep = 1,
  totalSteps = 1,
  showSteps = false,
  isLoading = false,
  hasUnsavedChanges = false,
  saveButtonText = 'Save Job',
  cancelButtonText = 'Cancel'
}) => {
  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (confirmClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const stepLabels = [
    'Basic Info',
    'Company Details', 
    'Application Status',
    'Notes & Documents'
  ];

  return (
    <div className="sticky top-0 z-10 bg-surface border-b border-border">
      {/* Main Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        {/* Left Section - Title */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="text-xs text-warning font-medium">Unsaved changes</span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelButtonText}
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={onSave}
              loading={isLoading}
            >
              {saveButtonText}
            </Button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150"
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>
      {/* Progress Steps */}
      {showSteps && totalSteps > 1 && (
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-4">
            {/* Step Indicators */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-150 ${
                      isCompleted
                        ? 'bg-success text-success-foreground'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-text-secondary'
                    }`}>
                      {isCompleted ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < totalSteps && (
                      <div className={`w-8 h-0.5 transition-colors duration-150 ${
                        stepNumber < currentStep ? 'bg-success' : 'bg-border'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Current Step Label */}
            <div className="hidden md:block">
              <span className="text-sm text-text-secondary">
                Step {currentStep} of {totalSteps}:
              </span>
              <span className="text-sm font-medium text-text-primary ml-1">
                {stepLabels?.[currentStep - 1] || `Step ${currentStep}`}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Actions Bar */}
      <div className="sm:hidden px-6 pb-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
          >
            {cancelButtonText}
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={onSave}
            loading={isLoading}
            fullWidth
          >
            {saveButtonText}
          </Button>
        </div>
      </div>
      {/* Keyboard Shortcuts Hint */}
      <div className="hidden lg:block absolute bottom-2 right-6">
        <div className="flex items-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
              S
            </kbd>
            <span>Save</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNavigation;