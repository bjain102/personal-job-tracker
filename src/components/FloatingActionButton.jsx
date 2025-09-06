import React from 'react';
import Icon from './AppIcon';

const FloatingActionButton = ({ onClick, label = "Save for later" }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-tier-3 hover:shadow-tier-4 transition-all duration-200 group"
      title={label}
    >
      <div className="flex items-center space-x-2">
        <Icon name="Plus" size={20} />
        <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      </div>
    </button>
  );
};

export default FloatingActionButton;
