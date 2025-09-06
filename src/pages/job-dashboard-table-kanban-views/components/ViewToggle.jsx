import React from 'react';
import Icon from '../../../components/AppIcon';

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    {
      id: 'table',
      label: 'Table',
      icon: 'Table'
    },
    {
      id: 'board',
      label: 'Board',
      icon: 'Columns'
    }
  ];

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentView === view.id
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
          }`}
        >
          <Icon name={view.icon} size={16} />
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;