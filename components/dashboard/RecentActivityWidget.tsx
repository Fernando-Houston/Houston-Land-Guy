'use client';

import { useState, useEffect } from 'react';
import { Activity, Eye, Heart, Download, Search, MapPin, Clock, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'view' | 'save' | 'search' | 'download' | 'analysis';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    propertyId?: string;
    searchQuery?: string;
    neighborhood?: string;
    price?: number;
  };
}

export default function RecentActivityWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock activity data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'view',
        title: 'Viewed Property',
        description: '1234 Heights Blvd - $485,000',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        metadata: {
          propertyId: 'prop_1',
          neighborhood: 'The Heights',
          price: 485000
        }
      },
      {
        id: '2',
        type: 'save',
        title: 'Saved Property',
        description: '5678 Memorial Dr - $725,000',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        metadata: {
          propertyId: 'prop_2',
          neighborhood: 'Memorial',
          price: 725000
        }
      },
      {
        id: '3',
        type: 'search',
        title: 'Property Search',
        description: 'Searched "Heights homes under 500K"',
        timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        metadata: {
          searchQuery: 'Heights homes under 500K'
        }
      },
      {
        id: '4',
        type: 'analysis',
        title: 'Market Analysis',
        description: 'Generated River Oaks market report',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        metadata: {
          neighborhood: 'River Oaks'
        }
      },
      {
        id: '5',
        type: 'download',
        title: 'Downloaded Report',
        description: 'Q4 2024 Houston Market Intelligence',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      },
      {
        id: '6',
        type: 'view',
        title: 'Viewed Property',
        description: '910 River Oaks Blvd - $2,850,000',
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        metadata: {
          propertyId: 'prop_3',
          neighborhood: 'River Oaks',
          price: 2850000
        }
      },
      {
        id: '7',
        type: 'search',
        title: 'Deal Flow Search',
        description: 'Found 12 new investment opportunities',
        timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      }
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 600);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'save':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'search':
        return <Search className="w-4 h-4 text-green-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-purple-600" />;
      case 'analysis':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'view':
        return 'bg-blue-100';
      case 'save':
        return 'bg-red-100';
      case 'search':
        return 'bg-green-100';
      case 'download':
        return 'bg-purple-100';
      case 'analysis':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      {activity.metadata?.neighborhood && (
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.metadata.neighborhood}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Summary */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.filter(a => a.type === 'view').length}
                </p>
                <p className="text-xs text-gray-600">Properties Viewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.filter(a => a.type === 'search').length}
                </p>
                <p className="text-xs text-gray-600">Searches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.filter(a => a.type === 'save').length}
                </p>
                <p className="text-xs text-gray-600">Saved Items</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}