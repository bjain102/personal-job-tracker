import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobKanban = ({ 
  jobs, 
  onStatusChange, 
  onEditJob, 
  onDeleteJob
}) => {
  const [draggedJob, setDraggedJob] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const dragCounter = useRef(0);

  const statusColumns = [
    { 
      id: 'wishlist', 
      title: 'Wishlist', 
      icon: 'Heart',
      color: 'bg-gray-50 border-gray-200',
      headerColor: 'text-gray-700'
    },
    { 
      id: 'to apply', 
      title: 'To Apply', 
      icon: 'ClipboardList',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'text-yellow-700'
    },
    { 
      id: 'applied', 
      title: 'Applied', 
      icon: 'Send',
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'text-blue-700'
    },
    { 
      id: 'interview', 
      title: 'Interview', 
      icon: 'Calendar',
      color: 'bg-orange-50 border-orange-200',
      headerColor: 'text-orange-700'
    },
    { 
      id: 'offer', 
      title: 'Offer', 
      icon: 'Gift',
      color: 'bg-green-50 border-green-200',
      headerColor: 'text-green-700'
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      icon: 'XCircle',
      color: 'bg-red-50 border-red-200',
      headerColor: 'text-red-700'
    }
  ];

  const getJobsByStatus = (status) => {
    return jobs?.filter(job => job?.status === status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('text/html', e?.target?.outerHTML);
    // Create a custom drag image to avoid browser default behavior
    const dragImage = e.target.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = (e) => {
    setDraggedJob(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e?.preventDefault();
    dragCounter.current++;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    dragCounter.current--;
    if (dragCounter?.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, newStatus) => {
    e?.preventDefault();
    setDragOverColumn(null);
    dragCounter.current = 0;

    if (draggedJob && draggedJob?.status !== newStatus) {
      onStatusChange(draggedJob?.id, newStatus);
    }
    setDraggedJob(null);
  };

  const WishlistCard = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onDragEnd={handleDragEnd}
      onClick={() => onEditJob(job)}
      className={`bg-surface border border-border rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group ${
        draggedJob?.id === job.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-text-secondary text-xs">{job.company}</p>
        
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            <Icon name="ExternalLink" size={12} className="mr-1" />
            View Job
          </a>
        )}
        
        {job.notes && (
          <p className="text-xs text-text-secondary line-clamp-2 bg-muted p-2 rounded group-hover:bg-muted/80 transition-colors">
            {job.notes}
          </p>
        )}
      </div>
    </div>
  );

  const ToApplyCard = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onDragEnd={handleDragEnd}
      onClick={() => onEditJob(job)}
      className={`bg-surface border border-border rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group ${
        draggedJob?.id === job.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-text-secondary text-xs">{job.company}</p>
        
        {job.applicationDate && (
          <div className="flex items-center text-xs text-orange-600">
            <Icon name="Clock" size={12} className="mr-1" />
            Deadline: {formatDate(job.applicationDate)}
          </div>
        )}
        
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            <Icon name="ExternalLink" size={12} className="mr-1" />
            View Job
          </a>
        )}
      </div>
    </div>
  );

  const AppliedCard = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onDragEnd={handleDragEnd}
      onClick={() => onEditJob(job)}
      className={`bg-surface border border-border rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group ${
        draggedJob?.id === job.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-text-secondary text-xs">{job.company}</p>
        
        {job.applicationDate && (
          <div className="flex items-center text-xs text-blue-600">
            <Icon name="Calendar" size={12} className="mr-1" />
            Applied: {formatDate(job.applicationDate)}
          </div>
        )}
        
        {job.followUpDate && (
          <div className="flex items-center text-xs text-text-secondary">
            <Icon name="Clock" size={12} className="mr-1" />
            Follow-up: {formatDate(job.followUpDate)}
          </div>
        )}
        
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            <Icon name="ExternalLink" size={12} className="mr-1" />
            View Job
          </a>
        )}
      </div>
    </div>
  );

  const InterviewCard = ({ job }) => {
    const interviewDateTime = job.followUpDate ? formatDateTime(job.followUpDate) : null;
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, job)}
        onDragEnd={handleDragEnd}
        onClick={() => onEditJob(job)}
        className={`bg-surface border border-border rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group ${
          draggedJob?.id === job.id ? 'dragging' : ''
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-text-secondary text-xs">{job.company}</p>
          
          {interviewDateTime && (
            <div className="bg-orange-50 p-2 rounded border border-orange-200">
              <div className="flex items-center text-sm text-orange-700 font-medium">
                <Icon name="Calendar" size={14} className="mr-1" />
                {interviewDateTime.date} at {interviewDateTime.time}
              </div>
            </div>
          )}
          
          {job.notes && (
            <p className="text-xs text-text-secondary bg-muted p-2 rounded group-hover:bg-muted/80 transition-colors">
              {job.notes}
            </p>
          )}
          
          {job.jobLink && (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
            >
              <Icon name="ExternalLink" size={12} className="mr-1" />
              View Job
            </a>
          )}
        </div>
      </div>
    );
  };

  const OfferCard = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onDragEnd={handleDragEnd}
      onClick={() => onEditJob(job)}
      className={`bg-surface border border-green-200 rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group bg-green-50 ${
        draggedJob?.id === job.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-text-secondary text-xs">{job.company}</p>
        
        {job.notes && job.notes.includes('$') && (
          <div className="flex items-center text-xs text-green-700 font-medium">
            <Icon name="DollarSign" size={12} className="mr-1" />
            {job.notes.split('\n')[0]}
          </div>
        )}
        
        {job.applicationDate && (
          <div className="flex items-center text-xs text-green-600">
            <Icon name="Gift" size={12} className="mr-1" />
            Received: {formatDate(job.applicationDate)}
          </div>
        )}
        
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            <Icon name="ExternalLink" size={12} className="mr-1" />
            View Job
          </a>
        )}
      </div>
    </div>
  );

  const RejectedCard = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onDragEnd={handleDragEnd}
      onClick={() => onEditJob(job)}
      className={`bg-surface border border-border rounded-lg p-3 mb-3 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group opacity-75 ${
        draggedJob?.id === job.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <Icon name="Edit3" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-text-secondary text-xs">{job.company}</p>
        
        {job.followUpDate && (
          <div className="flex items-center text-xs text-text-secondary">
            <Icon name="XCircle" size={12} className="mr-1" />
            Rejected: {formatDate(job.followUpDate)}
          </div>
        )}
        
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-text-secondary hover:text-text-secondary-dark hover:underline transition-colors"
          >
            <Icon name="ExternalLink" size={12} className="mr-1" />
            View Job
          </a>
        )}
      </div>
    </div>
  );

  const renderJobCard = (job) => {
    switch (job.status) {
      case 'wishlist':
        return <WishlistCard key={job.id} job={job} />;
      case 'to apply':
        return <ToApplyCard key={job.id} job={job} />;
      case 'applied':
        return <AppliedCard key={job.id} job={job} />;
      case 'interview':
        return <InterviewCard key={job.id} job={job} />;
      case 'offer':
        return <OfferCard key={job.id} job={job} />;
      case 'rejected':
        return <RejectedCard key={job.id} job={job} />;
      default:
        return <WishlistCard key={job.id} job={job} />;
    }
  };

  return (
    <div className="h-full bg-surface rounded-lg border border-border shadow-tier-1 flex flex-col">
      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-6 gap-3 p-4 min-h-0">
        {statusColumns?.map((column) => {
          const columnJobs = getJobsByStatus(column?.id);
          const isDragOver = dragOverColumn === column?.id;

          return (
            <div
              key={column?.id}
              className={`${column?.color} border-2 rounded-lg transition-all duration-200 flex flex-col ${
                isDragOver ? 'border-primary bg-primary/5' : ''
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column?.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column?.id)}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={column?.icon} size={14} className={column?.headerColor} />
                    <h2 className={`font-semibold text-sm ${column?.headerColor}`}>
                      {column?.title}
                    </h2>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${column?.headerColor}`}>
                    {columnJobs?.length}
                  </span>
                </div>
              </div>
              {/* Column Content */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-0">
                {columnJobs?.map((job) => renderJobCard(job))}

                {/* Empty State */}
                {columnJobs?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center h-full min-h-[200px]">
                    <Icon name={column?.icon} size={24} className="text-text-secondary mb-2" />
                    <p className="text-xs text-text-secondary">
                      No jobs in {column?.title?.toLowerCase()}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Drag jobs here to update status
                    </p>
                  </div>
                )}

                {/* Drop Zone Indicator */}
                {isDragOver && draggedJob && (
                  <div className="border-2 border-dashed border-primary bg-primary/10 rounded-lg p-3 text-center">
                    <Icon name="ArrowDown" size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-primary font-medium">
                      Drop to move to {column?.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Mobile Responsive Message */}
      <div className="lg:hidden p-4 flex-shrink-0">
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <Icon name="Smartphone" size={32} className="mx-auto text-text-secondary mb-3" />
          <h3 className="text-base font-medium text-text-primary mb-2">
            Kanban View
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            For the best drag-and-drop experience, please use a desktop or tablet device.
          </p>
          <Button variant="outline" size="sm">
            Switch to Table View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobKanban;