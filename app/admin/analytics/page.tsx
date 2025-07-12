'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  Clock,
  Activity,
  TrendingUp,
  BarChart3,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7');
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    topReferrers: [],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    countries: []
  });

  useEffect(() => {
    // In a real implementation, this would fetch from your analytics API
    // For now, using mock data
    setAnalyticsData({
      pageViews: 12847,
      uniqueVisitors: 3421,
      avgSessionDuration: 234, // seconds
      bounceRate: 42.3,
      topPages: [
        { path: '/', views: 3421, avgTime: 156 },
        { path: '/roi-calculator', views: 2134, avgTime: 342 },
        { path: '/tools/market-dashboard', views: 1876, avgTime: 423 },
        { path: '/developers', views: 1543, avgTime: 234 },
        { path: '/tools/financing-calculator', views: 987, avgTime: 387 }
      ],
      topReferrers: [
        { source: 'google', visits: 4532 },
        { source: 'direct', visits: 3421 },
        { source: 'linkedin.com', visits: 876 },
        { source: 'facebook.com', visits: 654 },
        { source: 'twitter.com', visits: 234 }
      ],
      devices: { desktop: 65, mobile: 30, tablet: 5 },
      countries: [
        { name: 'United States', percentage: 92 },
        { name: 'Canada', percentage: 3 },
        { name: 'Mexico', percentage: 2 },
        { name: 'Other', percentage: 3 }
      ]
    });
  }, [timeRange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <div className="mt-4 flex items-center justify-between">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <div className="flex gap-2">
            <a
              href="https://vercel.com/houston-land-guy-s-projects/houston-development-intelligence/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              <ExternalLink className="w-4 h-4" />
              Vercel Analytics
            </a>
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Google Analytics
            </a>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.pageViews.toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.uniqueVisitors.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(analyticsData.avgSessionDuration)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.bounceRate}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.path}</p>
                  <p className="text-xs text-gray-500">
                    {page.views.toLocaleString()} views • {formatDuration(page.avgTime)} avg
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
          <div className="space-y-3">
            {analyticsData.topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{referrer.source}</p>
                  <p className="text-xs text-gray-500">
                    {referrer.visits.toLocaleString()} visits
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(referrer.visits / analyticsData.topReferrers[0].visits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{analyticsData.devices.desktop}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.devices.desktop}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{analyticsData.devices.mobile}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.devices.mobile}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Tablet</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{analyticsData.devices.tablet}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.devices.tablet}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
          <div className="space-y-3">
            {analyticsData.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{country.percentage}%</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Analytics Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-blue-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Analytics Setup</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>• <strong>Vercel Analytics</strong> is automatically tracking page views and Web Vitals</p>
          <p>• <strong>Google Analytics</strong> requires adding your GA Measurement ID to environment variables</p>
          <p>• Add <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code> to your Vercel environment variables</p>
          <p>• Both analytics platforms are integrated and will track conversions from lead forms</p>
        </div>
      </motion.div>
    </div>
  );
}