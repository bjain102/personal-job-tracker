import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ jobs, onFilterChange }) => {
  const getCoreMetrics = () => {
    const metrics = {
      jobsSaved: 0,        // Wishlist count
      applicationsMade: 0, // Applied + Interview + Offer + Rejected
      interviewsSecured: 0, // Interview count
      offersReceived: 0,    // Offer count
      applicationsThisWeek: 0, // Applications made in the last 7 days
      pendingFollowUps: 0  // Jobs that need follow-up
    };

    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    jobs?.forEach(job => {
      const status = job?.status?.toLowerCase();
      
      if (status === 'wishlist') {
        metrics.jobsSaved++;
      } else if (['applied', 'interview', 'offer', 'rejected'].includes(status)) {
        metrics.applicationsMade++;
      }
      
      if (status === 'interview') {
        metrics.interviewsSecured++;
      }
      
      if (status === 'offer') {
        metrics.offersReceived++;
      }

      // Count applications this week
      if (job?.applicationDate) {
        const appDate = new Date(job.applicationDate);
        if (appDate >= oneWeekAgo && ['applied', 'interview', 'offer', 'rejected'].includes(status)) {
          metrics.applicationsThisWeek++;
        }
      }

      // Count pending follow-ups
      if (status === 'applied') {
        if (job?.followUpDate) {
          // If followUpDate is provided, check if it's today or overdue
          const followUpDate = new Date(job.followUpDate);
          if (followUpDate <= today) {
            metrics.pendingFollowUps++;
          }
        } else if (job?.applicationDate) {
          // If no followUpDate, count jobs older than 1 week
          const appDate = new Date(job.applicationDate);
          const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (appDate <= oneWeekAgo) {
            metrics.pendingFollowUps++;
          }
        }
      }
    });

    return metrics;
  };

  const metrics = getCoreMetrics();

  const handleCardClick = (filterType) => {
    if (!onFilterChange) return;
    
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let filterCriteria = {};
    
    switch (filterType) {
      case 'jobsSaved':
        filterCriteria = { status: 'wishlist' };
        break;
      case 'applicationsMade':
        filterCriteria = { status: ['applied', 'interview', 'offer', 'rejected'] };
        break;
      case 'interviewsSecured':
        filterCriteria = { status: 'interview' };
        break;
      case 'offersReceived':
        filterCriteria = { status: 'offer' };
        break;
      case 'applicationsThisWeek':
        filterCriteria = { 
          status: ['applied', 'interview', 'offer', 'rejected'],
          applicationDateFrom: oneWeekAgo
        };
        break;
      case 'pendingFollowUps':
        filterCriteria = { 
          status: 'applied',
          needsFollowUp: true
        };
        break;
      default:
        return;
    }
    
    onFilterChange(filterCriteria);
  };

  const mainCards = [
    {
      title: 'Jobs Saved',
      value: metrics.jobsSaved,
      icon: 'Bookmark',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Ready to apply!',
      actionable: true,
      filterType: 'jobsSaved'
    },
    {
      title: 'Applications Made',
      value: metrics.applicationsMade,
      icon: 'Send',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Progress made!',
      actionable: true,
      filterType: 'applicationsMade'
    },
    {
      title: 'Interviews Secured',
      value: metrics.interviewsSecured,
      icon: 'Calendar',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Almost there!',
      actionable: true,
      filterType: 'interviewsSecured'
    },
    {
      title: 'Offers Received',
      value: metrics.offersReceived,
      icon: 'Gift',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Success!',
      actionable: true,
      filterType: 'offersReceived'
    }
  ];

  const additionalCards = [
    {
      title: 'Applications This Week',
      value: metrics.applicationsThisWeek,
      icon: 'TrendingUp',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Keep up the momentum!',
      actionable: true,
      filterType: 'applicationsThisWeek'
    },
    {
      title: 'Pending Follow-ups',
      value: metrics.pendingFollowUps,
      icon: 'Clock',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Reach out for updates.',
      actionable: true,
      filterType: 'pendingFollowUps'
    }
  ];

  const renderCard = (card, index) => (
    <div 
      key={index} 
      onClick={() => card.value > 0 && handleCardClick(card.filterType)}
      className={`bg-surface border border-border rounded-lg p-4 shadow-tier-1 hover:shadow-tier-2 transition-all duration-200 ${
        card.value > 0 ? 'hover:border-primary/30 cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{card?.title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{card?.value}</p>
          <p className="text-xs text-text-secondary mt-1">{card?.description}</p>
        </div>
        <div className={`p-3 rounded-lg ${card?.bgColor} flex-shrink-0`}>
          <Icon name={card?.icon} size={24} className={card?.color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Main 4 cards on top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {mainCards?.map((card, index) => renderCard(card, index))}
      </div>
      
      {/* Additional 2 cards below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {additionalCards?.map((card, index) => renderCard(card, index + 4))}
      </div>
    </div>
  );
};

export default QuickStats;