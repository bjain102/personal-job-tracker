import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ jobs }) => {
  const getCoreMetrics = () => {
    const metrics = {
      jobsSaved: 0,        // Wishlist count
      applicationsMade: 0, // Applied + Interview + Offer + Rejected
      interviewsSecured: 0, // Interview count
      offersReceived: 0    // Offer count
    };

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
    });

    return metrics;
  };

  const metrics = getCoreMetrics();

  const statCards = [
    {
      title: 'Jobs Saved',
      value: metrics.jobsSaved,
      icon: 'Bookmark',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Ready to apply!',
      actionable: true
    },
    {
      title: 'Applications Made',
      value: metrics.applicationsMade,
      icon: 'Send',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Progress made!',
      actionable: false
    },
    {
      title: 'Interviews Secured',
      value: metrics.interviewsSecured,
      icon: 'Calendar',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Almost there!',
      actionable: false
    },
    {
      title: 'Offers Received',
      value: metrics.offersReceived,
      icon: 'Gift',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Success!',
      actionable: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((card, index) => (
        <div 
          key={index} 
          className={`bg-surface border border-border rounded-lg p-4 shadow-tier-1 hover:shadow-tier-2 transition-all duration-200 ${
            card.actionable && card.value > 0 ? 'hover:border-primary/30 cursor-pointer' : ''
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
      ))}
    </div>
  );
};

export default QuickStats;