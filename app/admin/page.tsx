'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Calculator,
  Eye,
  DollarSign,
  Calendar,
  Activity,
  Building,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { format, subDays } from 'date-fns';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7');
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    conversionRate: 0,
    avgLeadScore: 0,
    totalPageViews: 0,
    toolsUsage: 0,
    avgSessionDuration: 0,
    bounceRate: 0
  });

  const [leadsBySource, setLeadsBySource] = useState<any[]>([]);
  const [leadsTrend, setLeadsTrend] = useState<any[]>([]);
  const [toolsUsageData, setToolsUsageData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      // Fetch metrics
      const metricsResponse = await fetch(`/api/admin/metrics?days=${dateRange}`);
      const metricsData = await metricsResponse.json();
      
      // For now, use mock data
      setMetrics({
        totalLeads: 127,
        newLeads: 23,
        conversionRate: 12.5,
        avgLeadScore: 68,
        totalPageViews: 3847,
        toolsUsage: 892,
        avgSessionDuration: 4.2,
        bounceRate: 42.3
      });

      // Mock leads by source
      setLeadsBySource([
        { name: 'ROI Calculator', value: 35, percentage: 27.6 },
        { name: 'Market Dashboard', value: 28, percentage: 22.0 },
        { name: 'Direct Contact', value: 24, percentage: 18.9 },
        { name: 'Financing Calculator', value: 20, percentage: 15.7 },
        { name: 'Other', value: 20, percentage: 15.8 }
      ]);

      // Mock leads trend
      const trend = [];
      for (let i = parseInt(dateRange) - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        trend.push({
          date: format(date, 'MMM d'),
          leads: Math.floor(Math.random() * 10) + 5,
          conversions: Math.floor(Math.random() * 3)
        });
      }
      setLeadsTrend(trend);

      // Mock tools usage
      setToolsUsageData([
        { name: 'ROI Calculator', sessions: 342, avgDuration: 5.2 },
        { name: 'Market Dashboard', sessions: 289, avgDuration: 8.7 },
        { name: 'Financing Calculator', sessions: 156, avgDuration: 6.3 },
        { name: 'Zoning Explorer', sessions: 105, avgDuration: 4.1 }
      ]);

      // Mock top pages
      setTopPages([
        { page: '/roi-calculator', views: 892, avgTime: '3:45' },
        { page: '/tools/market-dashboard', views: 654, avgTime: '5:23' },
        { page: '/developers', views: 543, avgTime: '2:17' },
        { page: '/', views: 487, avgTime: '1:32' },
        { page: '/tools/financing-calculator', views: 321, avgTime: '4:12' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, change, changeType = 'increase' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {change}% from last period
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="mt-4 flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Generate Report
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          icon={Users}
          change={12.5}
          changeType="increase"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={TrendingUp}
          change={3.2}
          changeType="increase"
        />
        <MetricCard
          title="Tools Usage"
          value={metrics.toolsUsage}
          icon={Calculator}
          change={8.7}
          changeType="increase"
        />
        <MetricCard
          title="Avg Lead Score"
          value={metrics.avgLeadScore}
          icon={Activity}
          change={5.4}
          changeType="decrease"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Leads Trend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Leads Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="#10B981" 
                strokeWidth={2}
                name="New Leads"
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Leads by Source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadsBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools Usage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Tools Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={toolsUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#3B82F6" name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <p className="text-xs text-gray-500">{page.views} views • {page.avgTime} avg</p>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(page.views / topPages[0].views) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white rounded-lg shadow p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Lead Activity</h2>
          <Link href="/admin/leads" className="text-green-600 hover:text-green-700 text-sm">
            View all leads →
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { name: 'John Smith', email: 'john@buildercorp.com', source: 'ROI Calculator', time: '5 minutes ago' },
            { name: 'Sarah Johnson', email: 'sarah@developmentgroup.com', source: 'Market Dashboard', time: '23 minutes ago' },
            { name: 'Michael Chen', email: 'mchen@realestate.com', source: 'Direct Contact', time: '1 hour ago' },
            { name: 'Emily Davis', email: 'emily@construction.com', source: 'Financing Calculator', time: '2 hours ago' }
          ].map((lead, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{lead.source}</p>
                <p className="text-xs text-gray-500">{lead.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}