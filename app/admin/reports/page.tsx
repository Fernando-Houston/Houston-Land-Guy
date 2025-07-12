'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Printer,
  Mail
} from 'lucide-react';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

interface Report {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reports, setReports] = useState<Report[]>([]);
  const [kpiData, setKpiData] = useState<any>({});

  useEffect(() => {
    // Mock data
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'December 2024 Performance Report',
        type: 'monthly',
        lastGenerated: '2024-12-15T10:00:00',
        status: 'ready',
        size: '2.4 MB'
      },
      {
        id: '2',
        name: 'Q4 2024 Market Analysis',
        type: 'quarterly',
        lastGenerated: '2024-12-01T10:00:00',
        status: 'ready',
        size: '5.6 MB'
      },
      {
        id: '3',
        name: 'Lead Generation Report - December',
        type: 'monthly',
        lastGenerated: '2024-12-15T10:00:00',
        status: 'ready',
        size: '1.2 MB'
      },
      {
        id: '4',
        name: '2024 Annual Summary',
        type: 'annual',
        lastGenerated: '2024-12-10T10:00:00',
        status: 'generating',
        size: '-'
      }
    ];

    setReports(mockReports);

    // Mock KPI data
    setKpiData({
      totalLeads: 1245,
      leadGrowth: 23.5,
      conversionRate: 14.8,
      conversionGrowth: 3.2,
      avgDealSize: 2850000,
      dealSizeGrowth: 12.7,
      totalRevenue: 8550000,
      revenueGrowth: 45.2
    });
  }, [timeRange]);

  // Mock data for charts
  const monthlyLeadsData = [
    { month: 'Jan', leads: 85, converted: 12 },
    { month: 'Feb', leads: 92, converted: 14 },
    { month: 'Mar', leads: 110, converted: 18 },
    { month: 'Apr', leads: 98, converted: 15 },
    { month: 'May', leads: 125, converted: 20 },
    { month: 'Jun', leads: 143, converted: 24 },
    { month: 'Jul', leads: 132, converted: 22 },
    { month: 'Aug', leads: 156, converted: 26 },
    { month: 'Sep', leads: 142, converted: 23 },
    { month: 'Oct', leads: 168, converted: 28 },
    { month: 'Nov', leads: 175, converted: 30 },
    { month: 'Dec', leads: 189, converted: 32 }
  ];

  const leadSourceData = [
    { source: 'Organic Search', value: 35, leads: 436 },
    { source: 'Tool Conversions', value: 28, leads: 348 },
    { source: 'Direct Traffic', value: 20, leads: 249 },
    { source: 'Social Media', value: 10, leads: 125 },
    { source: 'Referrals', value: 7, leads: 87 }
  ];

  const toolPerformanceData = [
    { tool: 'ROI Calculator', users: 3542, conversions: 656, rate: 18.5 },
    { tool: 'Market Dashboard', users: 2876, conversions: 354, rate: 12.3 },
    { tool: 'Financing Calc', users: 2341, conversions: 517, rate: 22.1 },
    { tool: 'Zoning Explorer', users: 1987, conversions: 173, rate: 8.7 },
    { tool: 'Timeline Tool', users: 1543, conversions: 238, rate: 15.4 }
  ];

  const revenueData = [
    { month: 'Q1', revenue: 1250000, deals: 3 },
    { month: 'Q2', revenue: 1875000, deals: 5 },
    { month: 'Q3', revenue: 2340000, deals: 6 },
    { month: 'Q4', revenue: 3085000, deals: 8 }
  ];

  const generateReport = (reportType: string) => {
    alert(`Generating ${reportType} report...`);
  };

  const downloadReport = (report: Report) => {
    alert(`Downloading ${report.name}...`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
            <button
              onClick={() => generateReport('custom')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Leads</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpiData.totalLeads}</p>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{kpiData.leadGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpiData.conversionRate}%</p>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{kpiData.conversionGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Deal Size</p>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(kpiData.avgDealSize / 1000000).toFixed(2)}M
          </p>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{kpiData.dealSizeGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(kpiData.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{kpiData.revenueGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">YTD</span>
          </div>
        </motion.div>
      </div>

      {/* Report Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'leads', 'tools', 'revenue'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedReport(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedReport === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-8">
          {/* Lead Generation Trend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Lead Generation Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyLeadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="converted" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lead Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Lead Sources</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Revenue by Quarter</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`} />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}

      {selectedReport === 'tools' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Tool Performance Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue Impact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {toolPerformanceData.map((tool, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tool.tool}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tool.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tool.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{tool.rate}%</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(tool.rate / 25) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(tool.conversions * 12500).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Generated Reports */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-lg shadow"
      >
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Generated Reports</h2>
        </div>
        <div className="divide-y">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
                    <span>•</span>
                    <span>Generated {new Date(report.lastGenerated).toLocaleDateString()}</span>
                    {report.size !== '-' && (
                      <>
                        <span>•</span>
                        <span>{report.size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {report.status === 'ready' ? (
                  <>
                    <button
                      onClick={() => downloadReport(report)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Printer className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 animate-spin" />
                    Generating...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button
          onClick={() => generateReport('weekly')}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
        >
          <Calendar className="w-6 h-6 text-gray-600 mb-2" />
          <h4 className="font-medium text-gray-900">Weekly Summary</h4>
          <p className="text-sm text-gray-600 mt-1">Quick overview of the past week</p>
        </button>
        <button
          onClick={() => generateReport('lead-analysis')}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
        >
          <Users className="w-6 h-6 text-gray-600 mb-2" />
          <h4 className="font-medium text-gray-900">Lead Analysis</h4>
          <p className="text-sm text-gray-600 mt-1">Deep dive into lead quality</p>
        </button>
        <button
          onClick={() => generateReport('roi')}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
        >
          <TrendingUp className="w-6 h-6 text-gray-600 mb-2" />
          <h4 className="font-medium text-gray-900">ROI Report</h4>
          <p className="text-sm text-gray-600 mt-1">Marketing and tool performance</p>
        </button>
      </motion.div>
    </div>
  );
}