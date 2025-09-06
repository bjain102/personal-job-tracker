import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ jobs }) => {
  const getStatsByStatus = () => {
    const stats = {
      total: jobs?.length,
      wishlist: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      decision: 0
    };

    jobs?.forEach(job => {
      if (stats?.hasOwnProperty(job?.status)) {
        stats[job.status]++;
      }
    });

    return stats;
  };

  const stats = getStatsByStatus();

  const getRecentActivity = () => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentApplications = jobs?.filter(job => {
      if (!job?.applicationDate) return false;
      const appDate = new Date(job.applicationDate);
      return appDate >= thisWeek;
    })?.length;

    const upcomingFollowUps = jobs?.filter(job => {
      if (!job?.followUpDate) return false;
      const followUpDate = new Date(job.followUpDate);
      return followUpDate >= today;
    })?.length;

    return { recentApplications, upcomingFollowUps };
  };

  const activity = getRecentActivity();

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.total,
      icon: 'Briefcase',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null
    },
    {
      title: 'Applied',
      value: stats?.applied,
      icon: 'Send',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: activity?.recentApplications > 0 ? `+${activity?.recentApplications} this week` : null
    },
    {
      title: 'Interviews',
      value: stats?.interview,
      icon: 'Calendar',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: null
    },
    {
      title: 'Offers',
      value: stats?.offer,
      icon: 'Gift',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null
    }
  ];

  const getSuccessRate = () => {
    if (stats?.applied === 0) return 0;
    return Math.round((stats?.interview / stats?.applied) * 100);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((card, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-4 shadow-tier-1 hover:shadow-tier-2 transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{card?.title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{card?.value}</p>
              {card?.change && (
                <p className="text-xs text-green-600 mt-1">{card?.change}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${card?.bgColor}`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
      {/* Additional Stats Row */}
      <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {/* Success Rate */}
        <div className="bg-surface border border-border rounded-lg p-4 shadow-tier-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Icon name="TrendingUp" size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Interview Rate</p>
              <p className="text-xl font-bold text-text-primary">{getSuccessRate()}%</p>
            </div>
          </div>
        </div>

        {/* Follow-ups */}
        <div className="bg-surface border border-border rounded-lg p-4 shadow-tier-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Icon name="Clock" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Follow-ups Due</p>
              <p className="text-xl font-bold text-text-primary">{activity?.upcomingFollowUps}</p>
            </div>
          </div>
        </div>

        {/* Pipeline Health */}
        <div className="bg-surface border border-border rounded-lg p-4 shadow-tier-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Icon name="Activity" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Pipeline Health</p>
              <p className="text-xl font-bold text-text-primary">
                {stats?.total > 0 ? 'Active' : 'Empty'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;