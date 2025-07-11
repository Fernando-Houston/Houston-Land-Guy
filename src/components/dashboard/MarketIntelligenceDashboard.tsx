'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Activity,
  Home,
  AlertCircle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useMarketData, useMarketTiming, useNeighborhoodComparison } from '@/hooks/useAPI';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { LeadCaptureModal } from '@/components/forms/LeadCaptureModal';
import { PropertyTypeDistribution, MarketInsightData, NeighborhoodData } from '@/lib/types/tools';


interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}

const NEIGHBORHOODS = [
  'River Oaks',
  'The Heights',
  'Montrose',
  'West University',
  'Memorial',
  'Bellaire',
  'Midtown',
  'EaDo',
  'Museum District',
  'Galleria'
];

const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#14B8A6', // teal
  '#F97316', // orange
  '#EC4899', // pink
];

export default function MarketIntelligenceDashboard() {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(['River Oaks', 'The Heights', 'Montrose']);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState(false);

  const { data: marketData, isLoading: marketLoading, refresh: refreshMarket } = useMarketData();
  const { data: timingData, isLoading: timingLoading } = useMarketTiming();
  const { data: comparisonData, isLoading: comparisonLoading } = useNeighborhoodComparison(selectedNeighborhoods);

  // Process data for charts
  const priceHistoryData = useMemo(() => {
    if (!marketData?.priceHistory) return [];
    return marketData.priceHistory.slice(-getDataPoints(timeRange));
  }, [marketData, timeRange]);

  const neighborhoodMetrics = useMemo(() => {
    if (!comparisonData) return [];
    return comparisonData.neighborhoods.map((n: NeighborhoodData) => ({
      name: n.name,
      avgPrice: n.avgPricePerSqFt,
      growth: n.yearOverYearGrowth,
      inventory: n.inventoryLevel,
      demand: n.demandScore,
    }));
  }, [comparisonData]);

  const marketTimingScore = useMemo(() => {
    if (!timingData) return null;
    return {
      overall: timingData.overallScore,
      buyScore: timingData.buyScore,
      sellScore: timingData.sellScore,
      holdScore: timingData.holdScore,
    };
  }, [timingData]);

  function getDataPoints(range: string): number {
    switch (range) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      default: return 90;
    }
  }

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => {
      if (prev.includes(neighborhood)) {
        return prev.filter(n => n !== neighborhood);
      }
      if (prev.length < 5) {
        return [...prev, neighborhood];
      }
      return prev;
    });
  };

  const requestDetailedReport = () => {
    if (!capturedEmail) {
      setShowLeadCapture(true);
    } else {
      // Download detailed report
      window.open('/api/reports/market-intelligence?format=pdf', '_blank');
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend }: MetricCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </motion.div>
  );

  if (marketLoading || timingLoading || comparisonLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time Houston market data and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => refreshMarket()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={requestDetailedReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          <div className="flex gap-2">
            {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Price per Sq Ft"
          value={`$${marketData?.currentMetrics?.avgPricePerSqFt || 0}`}
          change={marketData?.currentMetrics?.priceChange}
          icon={DollarSign}
          trend={marketData?.currentMetrics?.priceChange > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Days on Market"
          value={marketData?.currentMetrics?.daysOnMarket || 0}
          change={marketData?.currentMetrics?.domChange}
          icon={Calendar}
          trend={marketData?.currentMetrics?.domChange < 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Active Listings"
          value={marketData?.currentMetrics?.activeListings || 0}
          change={marketData?.currentMetrics?.listingsChange}
          icon={Home}
          trend={marketData?.currentMetrics?.listingsChange > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Market Score"
          value={marketTimingScore?.overall || 0}
          icon={Activity}
          trend="up"
        />
      </div>

      {/* Market Timing Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Market Timing Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-flex">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">
                  {marketTimingScore?.buyScore || 0}%
                </span>
              </div>
            </div>
            <h3 className="mt-2 font-medium">Buy Score</h3>
            <p className="text-sm text-gray-600">Good time to buy</p>
          </div>
          <div className="text-center">
            <div className="relative inline-flex">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {marketTimingScore?.sellScore || 0}%
                </span>
              </div>
            </div>
            <h3 className="mt-2 font-medium">Sell Score</h3>
            <p className="text-sm text-gray-600">Good time to sell</p>
          </div>
          <div className="text-center">
            <div className="relative inline-flex">
              <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">
                  {marketTimingScore?.holdScore || 0}%
                </span>
              </div>
            </div>
            <h3 className="mt-2 font-medium">Hold Score</h3>
            <p className="text-sm text-gray-600">Good time to hold</p>
          </div>
        </div>
      </motion.div>

      {/* Price History Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Price History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={priceHistoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="avgPrice"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Neighborhood Comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Neighborhood Comparison</h2>
          <button
            onClick={() => setShowLeadCapture(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            <Filter className="w-4 h-4 inline mr-1" />
            Filter Neighborhoods
          </button>
        </div>
        
        {/* Neighborhood Selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {NEIGHBORHOODS.map((neighborhood) => (
            <button
              key={neighborhood}
              onClick={() => handleNeighborhoodToggle(neighborhood)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedNeighborhoods.includes(neighborhood)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {neighborhood}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={neighborhoodMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgPrice" fill="#3B82F6" name="Avg $/sqft" />
            <Bar dataKey="growth" fill="#10B981" name="YoY Growth %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Market Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Property Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketData?.propertyTypeDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(marketData?.propertyTypeDistribution || []).map((entry: PropertyTypeDistribution, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Demand Score by Area</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={neighborhoodMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Demand Score"
                dataKey="demand"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Key Market Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData?.insights?.map((insight: MarketInsightData, index: number) => (
            <div key={typeof insight === 'string' ? index : insight.id || index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{typeof insight === 'string' ? insight : insight.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          onSuccess={() => {
            setCapturedEmail(true);
            setShowLeadCapture(false);
          }}
          source="market_intelligence_dashboard"
        />
      )}
    </div>
  );
}