'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  User,
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  Eye,
  MessageSquare,
  Star,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Lead {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  company?: string;
  source: string;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'CONVERTED';
  score: number;
  neighborhoods: string[];
  projectTypes: string[];
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  _count?: {
    interactions: number;
    calculatorResults: number;
  };
}

const statusColors = {
  NEW: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
  QUALIFIED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  CONTACTED: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Phone },
  CONVERTED: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Star }
};

const sourceLabels: Record<string, string> = {
  ROI_CALCULATOR: 'ROI Calculator',
  MARKET_REPORT: 'Market Report',
  NEWSLETTER: 'Newsletter',
  DIRECT_CONTACT: 'Direct Contact',
  HERO_FORM: 'Hero Form',
  CONSULTATION_FORM: 'Consultation Form',
  DEVELOPERS_PAGE: 'Developers Page',
  SELLERS_PAGE: 'Sellers Page',
  INVESTORS_PAGE: 'Investors Page',
  financing_calculator: 'Financing Calculator',
  zoning_explorer: 'Zoning Explorer',
  market_intelligence_dashboard: 'Market Dashboard',
  development_timeline: 'Timeline Tool'
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    avgScore: 0,
    topSource: ''
  });

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, dateRange, sortBy]);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        source: sourceFilter,
        days: dateRange,
        sort: sortBy
      });

      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();
      
      if (data.leads) {
        setLeads(data.leads);
        calculateMetrics(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (leadsData: Lead[]) => {
    const total = leadsData.length;
    const newCount = leadsData.filter(l => l.status === 'NEW').length;
    const qualifiedCount = leadsData.filter(l => l.status === 'QUALIFIED').length;
    const convertedCount = leadsData.filter(l => l.status === 'CONVERTED').length;
    
    const avgScore = leadsData.reduce((sum, lead) => sum + lead.score, 0) / total || 0;
    
    // Find top source
    const sourceCounts = leadsData.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    setMetrics({
      totalLeads: total,
      newLeads: newCount,
      qualifiedLeads: qualifiedCount,
      conversionRate: total > 0 ? (convertedCount / total) * 100 : 0,
      avgScore: Math.round(avgScore),
      topSource
    });
  };

  const filteredLeads = leads.filter(lead => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.email.toLowerCase().includes(query) ||
        lead.name?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query) ||
        lead.phone?.includes(query)
      );
    }
    return true;
  });

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchLeads(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const exportLeads = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Score', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.name || '',
        lead.email,
        lead.phone || '',
        lead.company || '',
        sourceLabels[lead.source] || lead.source,
        lead.status,
        lead.score,
        format(new Date(lead.createdAt), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">Track and manage your development leads</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</p>
              </div>
              <User className="w-8 h-8 text-gray-400" />
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
                <p className="text-sm text-gray-600">New Leads</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.newLeads}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
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
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{metrics.qualifiedLeads}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
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
                <p className="text-sm text-gray-600">Conversion</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.avgScore}</p>
              </div>
              <Star className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Source</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {sourceLabels[metrics.topSource] || metrics.topSource}
                </p>
              </div>
              <Building className="w-8 h-8 text-gray-400" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={exportLeads}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="NEW">New</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CONVERTED">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Sources</option>
                    {Object.entries(sourceLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="score">Highest Score</option>
                    <option value="updatedAt">Recently Updated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(filteredLeads.map(l => l.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads([...selectedLeads, lead.id]);
                            } else {
                              setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          {lead.company && (
                            <div className="text-sm text-gray-500">{lead.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {sourceLabels[lead.source] || lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`text-sm rounded-full px-3 py-1 font-semibold ${statusColors[lead.status].bg} ${statusColors[lead.status].text} border-0 cursor-pointer`}
                        >
                          <option value="NEW">New</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Converted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                          <span className="text-gray-400 text-sm ml-1">/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.budgetMin || lead.budgetMax ? (
                          <div>
                            ${lead.budgetMin?.toLocaleString() || '0'} - 
                            ${lead.budgetMax?.toLocaleString() || '∞'}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Eye className="w-4 h-4 mr-1" />
                            {lead._count?.interactions || 0}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Calculator className="w-4 h-4 mr-1" />
                            {lead._count?.calculatorResults || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
                          </Link>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}