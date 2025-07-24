'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Eye, Trash2, Plus, Clock } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  criteria: string;
  resultCount: number;
  lastRun: Date;
  alertsEnabled: boolean;
  newResults: number;
}

export default function SavedSearchesWidget() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock saved searches data
    const mockSearches: SavedSearch[] = [
      {
        id: '1',
        name: 'Heights Homes Under $500K',
        criteria: 'The Heights • $300K-$500K • 3+ bed',
        resultCount: 12,
        lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        alertsEnabled: true,
        newResults: 3
      },
      {
        id: '2',
        name: 'Memorial Townhouses',
        criteria: 'Memorial • Townhouse • $600K-$800K',
        resultCount: 8,
        lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        alertsEnabled: true,
        newResults: 1
      },
      {
        id: '3',
        name: 'Investment Properties',
        criteria: 'Multiple areas • Under $400K • 2+ bed',
        resultCount: 24,
        lastRun: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        alertsEnabled: false,
        newResults: 0
      },
      {
        id: '4',
        name: 'Luxury River Oaks',
        criteria: 'River Oaks • $2M+ • 4+ bed',
        resultCount: 5,
        lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        alertsEnabled: true,
        newResults: 0
      }
    ];

    setTimeout(() => {
      setSavedSearches(mockSearches);
      setLoading(false);
    }, 800);
  }, []);

  const toggleAlerts = (id: string) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id
          ? { ...search, alertsEnabled: !search.alertsEnabled }
          : search
      )
    );
  };

  const deleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Saved Searches</h3>
          </div>
          <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            New Search
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No saved searches yet</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              Create your first search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{search.name}</h4>
                      {search.newResults > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {search.newResults} new
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{search.criteria}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{search.resultCount} results</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(search.lastRun)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <button
                      onClick={() => toggleAlerts(search.id)}
                      className={`p-1 rounded transition-colors ${
                        search.alertsEnabled
                          ? 'text-blue-600 hover:bg-blue-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="View results"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {savedSearches.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Run All Searches
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                Manage Alerts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}