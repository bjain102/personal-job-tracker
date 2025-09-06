import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobTable = ({ 
  jobs, 
  onEditJob, 
  onDeleteJob, 
  onStatusChange, 
  onAddJob
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'to apply', label: 'To Apply' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'decision', label: 'Decision' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      wishlist: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'Heart' },
      'to apply': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'ClipboardList' },
      applied: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'Send' },
      interview: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'Calendar' },
      offer: { bg: 'bg-green-100', text: 'text-green-700', icon: 'Gift' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: 'XCircle' },
      decision: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'CheckCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.wishlist;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs?.filter(job => {
      const matchesStatus = statusFilter === 'all' || job?.status === statusFilter;
      return matchesStatus;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'applicationDate' || sortConfig?.key === 'followUpDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [jobs, statusFilter, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="h-full bg-surface rounded-lg border border-border shadow-tier-1">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto h-full">
        <table className="w-full h-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-text-primary">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Job Title</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-primary">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Company</span>
                  {getSortIcon('company')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-primary">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Location</span>
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-primary">Status</th>
              <th className="text-left p-4 font-medium text-text-primary">
                <button
                  onClick={() => handleSort('applicationDate')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Applied</span>
                  {getSortIcon('applicationDate')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-primary">
                <button
                  onClick={() => handleSort('followUpDate')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Follow-up</span>
                  {getSortIcon('followUpDate')}
                </button>
              </th>
              <th className="text-right p-4 font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {filteredAndSortedJobs?.map((job) => (
              <tr key={job?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div>
                    <h3 className="font-medium text-text-primary">{job?.title}</h3>
                    {job?.jobLink && (
                      <a
                        href={job?.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center space-x-1 mt-1"
                      >
                        <Icon name="ExternalLink" size={12} />
                        <span>View Job</span>
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-text-primary">{job?.company}</span>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">{job?.location}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(job?.status)}
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">{formatDate(job?.applicationDate)}</span>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">{formatDate(job?.followUpDate)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditJob(job)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteJob(job?.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden h-full">
        {filteredAndSortedJobs?.map((job) => (
          <div key={job?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-text-primary mb-1">{job?.title}</h3>
                <p className="text-sm text-text-secondary">{job?.company}</p>
                <p className="text-xs text-text-secondary">{job?.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEditJob(job)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onDeleteJob(job?.id)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              {getStatusBadge(job?.status)}
              {job?.jobLink && (
                <a
                  href={job?.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center space-x-1"
                >
                  <Icon name="ExternalLink" size={12} />
                  <span>View Job</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
              <div>
                <span className="font-medium">Applied:</span>
                <span className="ml-1">{formatDate(job?.applicationDate)}</span>
              </div>
              <div>
                <span className="font-medium">Follow-up:</span>
                <span className="ml-1">{formatDate(job?.followUpDate)}</span>
              </div>
            </div>

            {job?.notes && (
              <div className="mt-3 p-2 bg-muted rounded text-xs text-text-secondary">
                <span className="font-medium">Notes:</span>
                <p className="mt-1">{job?.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredAndSortedJobs?.length === 0 && (
        <div className="p-8 text-center h-full flex items-center justify-center">
          <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No jobs found</h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your filters
          </p>
          <Button variant="default" iconName="Plus" iconPosition="left" onClick={onAddJob}>
            Add Your First Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobTable;