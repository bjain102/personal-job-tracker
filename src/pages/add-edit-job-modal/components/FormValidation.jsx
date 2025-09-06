import React from 'react';
import Icon from '../../../components/AppIcon';

const FormValidation = ({ errors, hasUnsavedChanges, isValid }) => {
  const errorCount = Object.keys(errors)?.filter(key => errors?.[key])?.length;
  
  if (errorCount === 0 && !hasUnsavedChanges) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
      {/* Validation Status */}
      {errorCount > 0 && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-error/10 rounded-full flex items-center justify-center mt-0.5">
            <Icon name="AlertCircle" size={12} className="text-error" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-error">
              {errorCount} validation {errorCount === 1 ? 'error' : 'errors'} found
            </h4>
            <ul className="mt-2 space-y-1">
              {Object.entries(errors)?.map(([field, error]) => 
                error && (
                  <li key={field} className="text-xs text-error flex items-center space-x-2">
                    <Icon name="Minus" size={8} />
                    <span>{error}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && errorCount === 0 && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-warning/10 rounded-full flex items-center justify-center mt-0.5">
            <Icon name="Clock" size={12} className="text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-warning">
              Unsaved changes
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Your changes will be lost if you close without saving
            </p>
          </div>
        </div>
      )}
      {/* Success State */}
      {errorCount === 0 && !hasUnsavedChanges && isValid && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-success/10 rounded-full flex items-center justify-center mt-0.5">
            <Icon name="CheckCircle" size={12} className="text-success" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-success">
              Form is valid
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Ready to save your job application
            </p>
          </div>
        </div>
      )}
      {/* Form Tips */}
      <div className="border-t border-border pt-3">
        <h5 className="text-xs font-medium text-text-primary mb-2">Tips:</h5>
        <ul className="space-y-1 text-xs text-text-secondary">
          <li className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={10} />
            <span>Use Ctrl+S to save quickly</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Link" size={10} />
            <span>Job links help you return to the original posting</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Calendar" size={10} />
            <span>Set follow-up dates to stay organized</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormValidation;