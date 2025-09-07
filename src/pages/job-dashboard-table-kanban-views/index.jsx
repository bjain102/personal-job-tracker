import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';

import JobTable from './components/JobTable';
import JobKanban from './components/JobKanban';
import ViewToggle from './components/ViewToggle';

import JobFilters from './components/JobFilters';
import QuickStats from './components/QuickStats';
import Button from '../../components/ui/Button';

import Icon from '../../components/AppIcon';
import { jobsService } from '../../lib/jobsService';
import FloatingActionButton from '../../components/FloatingActionButton';
import QuickAddModal from '../../components/QuickAddModal';
import AddJobModal from '../../components/AddJobModal';

const JobDashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [currentView, setCurrentView] = useState('table');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    startDate: '',
    endDate: '',
    company: '',
    location: ''
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Load jobs from Supabase
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobsService.getAllJobs();
        // Transform data to match existing component structure
        const transformedJobs = data.map(job => ({
          id: job.id,
          title: job.job_title,
          company: job.company,
          location: job.location,
          status: job.status?.toLowerCase() || 'wishlist',
          applicationDate: job.application_date,
          followUpDate: job.follow_up_date,
          jobLink: job.job_link,
          notes: job.notes
        }));
        setJobs(transformedJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleAddJob = () => {
    setEditingJob(null);
    setShowAddEditModal(true);
  };

  const handleQuickAdd = async (jobData) => {
    setIsQuickAdding(true);
    try {
      const newJob = await jobsService.addJob(jobData);
      // Transform and add to local state
      const transformedJob = {
        id: newJob.id,
        title: newJob.job_title,
        company: newJob.company,
        location: newJob.location,
        status: newJob.status?.toLowerCase() || 'wishlist',
        applicationDate: newJob.application_date,
        followUpDate: newJob.follow_up_date,
        jobLink: newJob.job_link,
        notes: newJob.notes
      };
      setJobs(prevJobs => [transformedJob, ...prevJobs]);
    } catch (error) {
      console.error('Failed to quick add job:', error);
      throw error; // Let the modal handle the error display
    } finally {
      setIsQuickAdding(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowAddEditModal(true);
  };

  const handleModalSave = async (jobData) => {
    try {
      if (editingJob) {
        // Update existing job
        const updatedJob = await jobsService.updateJob(editingJob.id, jobData);
        const transformedJob = {
          id: updatedJob.id,
          title: updatedJob.job_title,
          company: updatedJob.company,
          location: updatedJob.location,
          status: updatedJob.status?.toLowerCase() || 'wishlist',
          applicationDate: updatedJob.application_date,
          followUpDate: updatedJob.follow_up_date,
          jobLink: updatedJob.job_link,
          notes: updatedJob.notes
        };
        setJobs(prevJobs =>
          prevJobs.map(job => job.id === editingJob.id ? transformedJob : job)
        );
      } else {
        // Add new job
        const newJob = await jobsService.addJob(jobData);
        const transformedJob = {
          id: newJob.id,
          title: newJob.job_title,
          company: newJob.company,
          location: newJob.location,
          status: newJob.status?.toLowerCase() || 'wishlist',
          applicationDate: newJob.application_date,
          followUpDate: newJob.follow_up_date,
          jobLink: newJob.job_link,
          notes: newJob.notes
        };
        setJobs(prevJobs => [transformedJob, ...prevJobs]);
      }
      
      // Close modal and reset state
      setShowAddEditModal(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Failed to save job:', error);
      throw error; // Let the modal handle the error display
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await jobsService.deleteJob(jobId);
        setJobs(prevJobs => prevJobs?.filter(job => job?.id !== jobId));
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await jobsService.updateJobStatus(jobId, newStatus);
      setJobs(prevJobs =>
        prevJobs?.map(job =>
          job?.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update job status. Please try again.');
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleQuickStatsFilter = (filterCriteria) => {
    // Reset existing filters first
    const newFilters = {
      status: '',
      dateRange: '',
      startDate: '',
      endDate: '',
      company: '',
      location: ''
    };

    if (Array.isArray(filterCriteria.status)) {
      // For multiple statuses, we'll need to modify the filtering logic
      newFilters.multipleStatuses = filterCriteria.status;
    } else if (filterCriteria.status) {
      newFilters.status = filterCriteria.status;
    }

    if (filterCriteria.applicationDateFrom) {
      newFilters.dateRange = 'custom';
      newFilters.startDate = filterCriteria.applicationDateFrom.toISOString().split('T')[0];
    }

    if (filterCriteria.needsFollowUp) {
      newFilters.needsFollowUp = true;
    }

    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      startDate: '',
      endDate: '',
      company: '',
      location: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return filters.status || 
           filters.multipleStatuses || 
           filters.needsFollowUp || 
           filters.dateRange || 
           filters.company || 
           filters.location || 
           searchQuery;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e?.target?.value);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const getFilteredJobs = () => {
    return jobs?.filter(job => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery?.toLowerCase();
        const matchesTitle = job?.title?.toLowerCase()?.includes(query);
        const matchesCompany = job?.company?.toLowerCase()?.includes(query);
        const matchesLocation = job?.location?.toLowerCase()?.includes(query);
        
        if (!matchesTitle && !matchesCompany && !matchesLocation) {
          return false;
        }
      }

      // Multiple statuses filter (for Applications Made card)
      if (filters?.multipleStatuses) {
        if (!filters.multipleStatuses.includes(job?.status)) {
          return false;
        }
      }
      // Single status filter
      else if (filters?.status && job?.status !== filters?.status) {
        return false;
      }

      // Follow-up filter (for Pending Follow-ups card)
      if (filters?.needsFollowUp && job?.status === 'applied') {
        const today = new Date();
        let needsFollowUp = false;
        
        if (job?.followUpDate) {
          const followUpDate = new Date(job.followUpDate);
          needsFollowUp = followUpDate <= today;
        } else if (job?.applicationDate) {
          const appDate = new Date(job.applicationDate);
          const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          needsFollowUp = appDate <= oneWeekAgo;
        }
        
        if (!needsFollowUp) {
          return false;
        }
      }

      // Company filter
      if (filters?.company && !job?.company?.toLowerCase()?.includes(filters?.company?.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters?.location && !job?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters?.dateRange && job?.applicationDate) {
        const appDate = new Date(job.applicationDate);
        const today = new Date();
        
        switch (filters?.dateRange) {
          case 'today':
            if (appDate?.toDateString() !== today?.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (appDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            if (appDate < monthAgo) return false;
            break;
          case 'quarter':
            const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            if (appDate < quarterAgo) return false;
            break;
          case 'custom':
            if (filters?.startDate && appDate < new Date(filters.startDate)) return false;
            if (filters?.endDate && appDate > new Date(filters.endDate)) return false;
            break;
        }
      }

      return true;
    });
  };

  const filteredJobs = getFilteredJobs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Loading Skeleton */}
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-muted rounded w-48"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(6)]?.map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Job Application Dashboard
              </h1>
              <p className="text-text-secondary">
                Track and manage your job applications in one place
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6">
            <QuickStats jobs={jobs} onFilterChange={handleQuickStatsFilter} />
          </div>

          {/* Filter Status Banner */}
          {hasActiveFilters() && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={16} className="text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">
                  Filters applied - Showing {filteredJobs.length} of {jobs.length} jobs
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={resetFilters}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Search Bar with Controls */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, locations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Filter"
                  iconPosition="left"
                  onClick={() => setShowFiltersModal(true)}
                >
                  Filters
                </Button>
                {hasActiveFilters() && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={resetFilters}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddJob}
                >
                  Add Job
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {currentView === 'table' ? (
              <JobTable
                jobs={filteredJobs}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
                onStatusChange={handleStatusChange}
                onAddJob={handleAddJob}
              />
            ) : (
              <JobKanban
                jobs={filteredJobs}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
                onStatusChange={handleStatusChange}
                onAddJob={handleAddJob}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowQuickAdd(true)}
        label="Save for later"
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={handleQuickAdd}
        isLoading={isQuickAdding}
      />

      {/* Add/Edit Job Modal */}
      <AddJobModal
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingJob(null);
        }}
        onSave={handleModalSave}
        job={editingJob}
        isEditing={!!editingJob}
      />

      {/* Filters Modal */}
      <JobFilters
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default JobDashboard;