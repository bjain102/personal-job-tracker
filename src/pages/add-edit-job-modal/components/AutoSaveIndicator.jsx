import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveIndicator = ({ 
  isAutoSaving = false, 
  lastSaved = null, 
  hasUnsavedChanges = false,
  autoSaveEnabled = true 
}) => {
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    if (lastSaved && !isAutoSaving) {
      setShowSavedMessage(true);
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, isAutoSaving]);

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInSeconds = Math.floor((now - saved) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return saved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (!autoSaveEnabled) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
      <div className="flex items-center space-x-2">
        {/* Auto-save Status Icon */}
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isAutoSaving 
            ? 'bg-warning animate-pulse' 
            : hasUnsavedChanges 
            ? 'bg-error' :'bg-success'
        }`} />
        
        {/* Status Text */}
        <span className="text-xs font-medium text-text-secondary">
          {isAutoSaving ? (
            <span className="flex items-center space-x-1">
              <Icon name="RotateCw" size={12} className="animate-spin" />
              <span>Auto-saving...</span>
            </span>
          ) : showSavedMessage ? (
            <span className="flex items-center space-x-1 text-success">
              <Icon name="Check" size={12} />
              <span>Saved!</span>
            </span>
          ) : hasUnsavedChanges ? (
            <span className="flex items-center space-x-1 text-warning">
              <Icon name="Clock" size={12} />
              <span>Unsaved changes</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={12} />
              <span>All changes saved</span>
            </span>
          )}
        </span>
      </div>

      {/* Last Saved Time */}
      {lastSaved && !isAutoSaving && (
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={10} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">
            {formatLastSaved(lastSaved)}
          </span>
        </div>
      )}

      {/* Auto-save Settings */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Icon name="Zap" size={10} className="text-accent" />
          <span className="text-xs text-text-secondary">Auto-save</span>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;