import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardControlBar = ({ 
  currentView = 'table', 
  onViewChange = () => {}, 
  onAddJob = () => {},
  showFilters = false,
  onToggleFilters = () => {}
}) => {
  const [activeView, setActiveView] = useState(currentView);

  const handleViewChange = (view) => {
    setActiveView(view);
    onViewChange(view);
  };

  const viewOptions = [
    { value: 'table', label: 'Table', icon: 'Table' },
    { value: 'kanban', label: 'Kanban', icon: 'Columns' }
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-surface border-b border-border">
      {/* Left Section - View Toggle */}
      <div className="flex items-center space-x-4">
        {/* View Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          {viewOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleViewChange(option?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeView === option?.value
                  ? 'bg-surface text-text-primary shadow-tier-1'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }`}
            >
              <Icon name={option?.icon} size={16} />
              <span className="hidden sm:inline">{option?.label}</span>
            </button>
          ))}
        </div>

        {/* Filters Toggle - Desktop */}
        <button
          onClick={onToggleFilters}
          className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            showFilters
              ? 'bg-primary text-primary-foreground'
              : 'text-text-secondary hover:text-text-primary hover:bg-muted'
          }`}
        >
          <Icon name="Filter" size={16} />
          <span>Filters</span>
          {showFilters && (
            <div className="w-2 h-2 bg-accent rounded-full ml-1"></div>
          )}
        </button>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 w-64 bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
          />
        </div>
      </div>
      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search */}
        <button className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150">
          <Icon name="Search" size={20} />
        </button>

        {/* Mobile Filters */}
        <button
          onClick={onToggleFilters}
          className={`md:hidden p-2 rounded-lg transition-colors duration-150 ${
            showFilters
              ? 'bg-primary text-primary-foreground'
              : 'text-text-secondary hover:text-text-primary hover:bg-muted'
          }`}
        >
          <Icon name="Filter" size={20} />
        </button>

        {/* Sort Options */}
        <div className="hidden sm:flex items-center">
          <select className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150">
            <option value="date">Sort by Date</option>
            <option value="company">Sort by Company</option>
            <option value="status">Sort by Status</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        {/* View Options */}
        <button className="hidden md:flex p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150">
          <Icon name="MoreVertical" size={20} />
        </button>

        {/* Add Job Button */}
        <Button
          variant="default"
          size="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddJob}
          className="shadow-tier-1 hover:shadow-tier-2 transition-shadow duration-150"
        >
          <span className="hidden sm:inline">Add Job</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardControlBar;