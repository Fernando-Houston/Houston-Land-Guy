'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Clock,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

interface ToolUsageData {
  name: string;
  path: string;
  icon: any;
  totalUses: number;
  todayUses: number;
  weeklyUses: number;
  avgSessionTime: number;
  conversionRate: number;
}

export default function ToolsUsagePage() {
  const [timeRange, setTimeRange] = useState('7');
  const [toolsData, setToolsData] = useState<ToolUsageData[]>([]);
  const [dailyUsage, setDailyUsage] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);

  useEffect(() => {
    // In production, this would fetch from your analytics API
    // For now, using mock data that would come from Google Analytics events
    const mockToolsData: ToolUsageData[] = [
      {
        name: 'ROI Calculator',
        path: '/roi-calculator',
        icon: Calculator,
        totalUses: 3542,
        todayUses: 156,
        weeklyUses: 892,
        avgSessionTime: 245,
        conversionRate: 18.5
      },
      {
        name: 'Market Dashboard',
        path: '/tools/market-dashboard',
        icon: BarChart3,
        totalUses: 2876,
        todayUses: 134,
        weeklyUses: 743,
        avgSessionTime: 423,
        conversionRate: 12.3
      },
      {
        name: 'Financing Calculator',
        path: '/tools/financing-calculator',
        icon: DollarSign,
        totalUses: 2341,
        todayUses: 98,
        weeklyUses: 587,
        avgSessionTime: 387,
        conversionRate: 22.1
      },
      {
        name: 'Zoning Explorer',
        path: '/tools/zoning-explorer',
        icon: MapPin,
        totalUses: 1987,
        todayUses: 87,
        weeklyUses: 456,
        avgSessionTime: 156,
        conversionRate: 8.7
      },
      {
        name: 'Timeline Tool',
        path: '/tools/development-timeline',
        icon: Calendar,
        totalUses: 1543,
        todayUses: 65,
        weeklyUses: 342,
        avgSessionTime: 298,
        conversionRate: 15.4
      }
    ];

    setToolsData(mockToolsData);

    // Mock daily usage data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daily = days.map(day => ({
      day,
      'ROI Calculator': Math.floor(Math.random() * 200) + 100,
      'Market Dashboard': Math.floor(Math.random() * 150) + 80,
      'Financing Calculator': Math.floor(Math.random() * 120) + 60,
      'Zoning Explorer': Math.floor(Math.random() * 100) + 50,
      'Timeline Tool': Math.floor(Math.random() * 80) + 40
    }));
    setDailyUsage(daily);

    // Mock conversion funnel data
    setConversionData([
      { stage: 'Tool Visits', value: 10000, percentage: 100 },
      { stage: 'Engaged Users', value: 6500, percentage: 65 },
      { stage: 'Lead Form Views', value: 2800, percentage: 28 },
      { stage: 'Leads Captured', value: 1450, percentage: 14.5 },
      { stage: 'Qualified Leads', value: 580, percentage: 5.8 }
    ]);
  }, [timeRange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalToolUses = toolsData.reduce((sum, tool) => sum + tool.weeklyUses, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tools Usage Analytics</h1>
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

          <Link
            href="https://analytics.google.com"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            View in Google Analytics
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tool Uses</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalToolUses.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">+12.5% from last week</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Avg. Session Time</p>
              <p className="text-2xl font-bold text-gray-900">4:23</p>
              <p className="text-xs text-green-600 mt-1">+8.2% from last week</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Tool Conversions</p>
              <p className="text-2xl font-bold text-gray-900">14.5%</p>
              <p className="text-xs text-green-600 mt-1">+2.3% from last week</p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">2,341</p>
              <p className="text-xs text-green-600 mt-1">+18.7% from last week</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>
      </div>

      {/* Individual Tool Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Tool Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Uses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {toolsData.map((tool, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <tool.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.totalUses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.todayUses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.weeklyUses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(tool.avgSessionTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      tool.conversionRate > 15 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tool.conversionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={tool.path}
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                    >
                      View Tool
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Usage Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Daily Usage Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ROI Calculator" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Market Dashboard" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Financing Calculator" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="Zoning Explorer" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Timeline Tool" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tool Usage Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Usage Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toolsData.map(tool => ({ name: tool.name, value: tool.weeklyUses }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {toolsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-4">Tool Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981">
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {conversionData.map((stage, index) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-600">{stage.stage}</p>
                <p className="text-lg font-semibold text-gray-900">{stage.percentage}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-blue-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Tool Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>• <strong>ROI Calculator</strong> has the highest conversion rate - feature it prominently</p>
            <p>• <strong>Market Dashboard</strong> has longest session time - users find it valuable</p>
            <p>• Consider adding more CTAs to <strong>Zoning Explorer</strong> (lowest conversion)</p>
          </div>
          <div>
            <p>• Peak usage is Tuesday-Thursday, 10am-2pm CST</p>
            <p>• Mobile usage is 35% - ensure all tools are mobile-optimized</p>
            <p>• Users who use multiple tools convert at 3x higher rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}