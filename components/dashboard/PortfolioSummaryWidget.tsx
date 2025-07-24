'use client';

import { useState, useEffect } from 'react';
import { Building2, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, PieChart } from 'lucide-react';

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalROI: number;
  monthlyIncome: number;
  appreciation: number;
  propertyCount: number;
  topPerformer: {
    address: string;
    roi: number;
  };
  worstPerformer: {
    address: string;
    roi: number;
  };
}

export default function PortfolioSummaryWidget() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock portfolio data
    const mockPortfolio: PortfolioSummary = {
      totalValue: 2460000,
      totalInvested: 1950000,
      totalROI: 26.2,
      monthlyIncome: 7800,
      appreciation: 510000,
      propertyCount: 3,
      topPerformer: {
        address: '123 Main St, River Oaks',
        roi: 35.3
      },
      worstPerformer: {
        address: '789 Pine Dr, The Heights',
        roi: 14.1
      }
    };

    setTimeout(() => {
      setPortfolio(mockPortfolio);
      setLoading(false);
    }, 900);
  }, []);

  if (loading || !portfolio) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
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
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Summary</h3>
          </div>
          <a
            href="/intelligence/portfolio"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
      
      <div className="p-6">
        {/* Main Portfolio Value */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Portfolio Value</span>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{portfolio.totalROI.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${portfolio.totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {portfolio.propertyCount} properties • ${portfolio.totalInvested.toLocaleString()} invested
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Monthly</span>
            </div>
            <p className="text-xl font-bold text-green-900">
              ${portfolio.monthlyIncome.toLocaleString()}
            </p>
            <p className="text-xs text-green-700">Cash Flow</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Total</span>
            </div>
            <p className="text-xl font-bold text-blue-900">
              ${portfolio.appreciation.toLocaleString()}
            </p>
            <p className="text-xs text-blue-700">Appreciation</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Performance Overview</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-xs text-green-700 font-medium">Top Performer</p>
                <p className="text-sm text-green-900">{portfolio.topPerformer.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-sm font-bold">+{portfolio.topPerformer.roi}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-xs text-orange-700 font-medium">Needs Attention</p>
                <p className="text-sm text-orange-900">{portfolio.worstPerformer.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-orange-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-sm font-bold">+{portfolio.worstPerformer.roi}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <DollarSign className="w-4 h-4 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}