'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
  Filter,
  Download
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
  Cell
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  sentDate?: string;
  scheduledDate?: string;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  unsubscribeRate?: number;
}

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data - in production, fetch from your email service API
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'December Newsletter',
        subject: 'Houston Development Trends for 2025',
        status: 'sent',
        recipients: 1245,
        sentDate: '2024-12-15',
        openRate: 42.3,
        clickRate: 12.7,
        conversionRate: 3.2,
        unsubscribeRate: 0.8
      },
      {
        id: '2',
        name: 'New Tool Announcement',
        subject: 'Introducing the Development Timeline Tool',
        status: 'sent',
        recipients: 987,
        sentDate: '2024-12-10',
        openRate: 56.8,
        clickRate: 23.4,
        conversionRate: 5.6,
        unsubscribeRate: 0.3
      },
      {
        id: '3',
        name: 'Market Report Q4',
        subject: 'Q4 2024 Houston Real Estate Market Report',
        status: 'scheduled',
        recipients: 1567,
        scheduledDate: '2024-12-20T10:00:00',
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        unsubscribeRate: 0
      },
      {
        id: '4',
        name: 'Welcome Series - Email 1',
        subject: 'Welcome to Houston Development Intelligence',
        status: 'active',
        recipients: 234,
        openRate: 68.4,
        clickRate: 31.2,
        conversionRate: 8.9,
        unsubscribeRate: 0.5
      },
      {
        id: '5',
        name: 'Year End Special',
        subject: 'Special Year-End Development Opportunities',
        status: 'draft',
        recipients: 0
      }
    ];

    setCampaigns(mockCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => 
    filterStatus === 'all' || campaign.status === filterStatus
  );

  const totalStats = {
    totalSent: campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0),
    avgOpenRate: campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.status === 'sent').length,
    avgClickRate: campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + (c.clickRate || 0), 0) / campaigns.filter(c => c.status === 'sent').length,
    totalConverted: Math.floor(campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients * (c.conversionRate || 0) / 100, 0))
  };

  // Mock performance data
  const performanceData = [
    { month: 'Jul', sent: 3200, opened: 1280, clicked: 384 },
    { month: 'Aug', sent: 3500, opened: 1575, clicked: 473 },
    { month: 'Sep', sent: 2800, opened: 1344, clicked: 336 },
    { month: 'Oct', sent: 4200, opened: 2100, clicked: 630 },
    { month: 'Nov', sent: 3800, opened: 1976, clicked: 570 },
    { month: 'Dec', sent: 2232, opened: 1116, clicked: 335 }
  ];

  const segmentData = [
    { name: 'Developers', value: 45 },
    { name: 'Sellers', value: 30 },
    { name: 'Investors', value: 15 },
    { name: 'Agents', value: 10 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
          <button
            onClick={() => setShowNewCampaign(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
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
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalSent.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </div>
            <Send className="w-8 h-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.avgOpenRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-1">+5.2% vs last month</p>
            </div>
            <Eye className="w-8 h-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Avg Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.avgClickRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-1">+3.1% vs last month</p>
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
              <p className="text-sm text-gray-600">Total Converted</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalConverted}
              </p>
              <p className="text-xs text-green-600 mt-1">From email campaigns</p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaigns List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">All Campaigns</h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {campaign.recipients} recipients
                    </div>
                    {campaign.sentDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.sentDate).toLocaleDateString()}
                      </div>
                    )}
                    {campaign.scheduledDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(campaign.scheduledDate).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {campaign.status === 'sent' && (
                    <div className="mt-3 grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Open Rate</p>
                        <p className="text-sm font-medium">{campaign.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Click Rate</p>
                        <p className="text-sm font-medium">{campaign.clickRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Conversion</p>
                        <p className="text-sm font-medium">{campaign.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Unsubscribed</p>
                        <p className="text-sm font-medium">{campaign.unsubscribeRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Charts */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Email Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="opened" stroke="#10B981" name="Opened" strokeWidth={2} />
                <Line type="monotone" dataKey="clicked" stroke="#3B82F6" name="Clicked" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Audience Segments</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* Campaign Templates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Email Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
            <h4 className="font-medium mb-2">Weekly Newsletter</h4>
            <p className="text-sm text-gray-600">Market updates and new listings</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Used 12 times</span>
              <button className="text-green-600 hover:text-green-700 text-sm">Use Template</button>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
            <h4 className="font-medium mb-2">Tool Announcement</h4>
            <p className="text-sm text-gray-600">New feature or tool launch</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Used 5 times</span>
              <button className="text-green-600 hover:text-green-700 text-sm">Use Template</button>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
            <h4 className="font-medium mb-2">Lead Nurture</h4>
            <p className="text-sm text-gray-600">Follow-up sequence for new leads</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Used 23 times</span>
              <button className="text-green-600 hover:text-green-700 text-sm">Use Template</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-blue-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Email Marketing Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>• Send emails Tuesday-Thursday for best open rates</p>
            <p>• Keep subject lines under 50 characters</p>
            <p>• Personalize with recipient's name and interests</p>
          </div>
          <div>
            <p>• Include clear CTAs above the fold</p>
            <p>• Test different send times for your audience</p>
            <p>• Segment lists for targeted messaging</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}