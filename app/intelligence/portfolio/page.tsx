'use client';

import { useState, useEffect } from 'react';
// Removed UI component imports to fix build error - using native HTML instead
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Target,
  MapPin,
  Calendar,
  AlertTriangle,
  Building2,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Settings
} from 'lucide-react';

interface PortfolioProperty {
  id: string;
  address: string;
  neighborhood: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  propertyType: string;
  status: 'owned' | 'under_contract' | 'sold';
  roi: number;
  monthlyIncome?: number;
  expenses?: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalInvested: number;
  totalROI: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
  appreciation: number;
  activeProperties: number;
}

export default function PortfolioAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [portfolioData, setPortfolioData] = useState<PortfolioProperty[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockPortfolio: PortfolioProperty[] = [
      {
        id: '1',
        address: '123 Main St, River Oaks',
        neighborhood: 'River Oaks',
        purchasePrice: 850000,
        currentValue: 1150000,
        purchaseDate: '2022-03-15',
        propertyType: 'Single Family',
        status: 'owned',
        roi: 35.3,
        monthlyIncome: 4800,
        expenses: 1200
      },
      {
        id: '2',
        address: '456 Oak Ave, Memorial',
        neighborhood: 'Memorial',
        purchasePrice: 675000,
        currentValue: 825000,
        purchaseDate: '2023-01-10',
        propertyType: 'Townhouse',
        status: 'owned',
        roi: 22.2,
        monthlyIncome: 3200,
        expenses: 800
      },
      {
        id: '3',
        address: '789 Pine Dr, The Heights',
        neighborhood: 'The Heights',
        purchasePrice: 425000,
        currentValue: 485000,
        purchaseDate: '2023-06-20',
        propertyType: 'Condo',
        status: 'owned',
        roi: 14.1,
        monthlyIncome: 2400,
        expenses: 600
      }
    ];

    const mockMetrics: PortfolioMetrics = {
      totalValue: 2460000,
      totalInvested: 1950000,
      totalROI: 26.2,
      monthlyIncome: 10400,
      monthlyExpenses: 2600,
      netCashFlow: 7800,
      appreciation: 510000,
      activeProperties: 3
    };

    setTimeout(() => {
      setPortfolioData(mockPortfolio);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getROIColor = (roi: number) => {
    if (roi >= 25) return 'text-green-600';
    if (roi >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'owned':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Owned</span>;
      case 'under_contract':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Under Contract</span>;
      case 'sold':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Sold</span>;
      default:
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-full">{status}</span>;
    }
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-white/20 text-white border border-white/30 rounded-full">
              AI-Powered Analytics
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Portfolio Analytics
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Advanced real estate portfolio tracking with market intelligence integration
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +{metrics.totalROI.toFixed(1)}% Total ROI
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Net Cash Flow</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.netCashFlow.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <Activity className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">
                      ${metrics.monthlyIncome.toLocaleString()} income
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Appreciation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.appreciation.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +{((metrics.appreciation / metrics.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.activeProperties}
                  </p>
                  <div className="flex items-center mt-2">
                    <Building2 className="w-4 h-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600 font-medium">
                      Properties owned
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Portfolio Performance
                </h3>
                <div className="flex gap-2">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimeframe(period)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        selectedTimeframe === period 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive performance chart</p>
                  <p className="text-sm text-gray-500">Showing portfolio value over time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Property Distribution
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Single Family</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '33.3%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Townhouse</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '33.3%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Condo</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '33.3%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Portfolio Properties
              </h3>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-md hover:from-purple-700 hover:to-purple-800 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Purchase Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Current Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ROI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Cash Flow</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{property.address}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{property.neighborhood}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">${property.purchasePrice.toLocaleString()}</span>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{property.purchaseDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">${property.currentValue.toLocaleString()}</span>
                        <div className="flex items-center mt-1">
                          <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">
                            +${(property.currentValue - property.purchasePrice).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getROIColor(property.roi)}`}>
                          {property.roi.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {property.monthlyIncome && property.expenses ? (
                          <div>
                            <span className="font-medium text-green-600">
                              +${(property.monthlyIncome - property.expenses).toLocaleString()}/mo
                            </span>
                            <p className="text-xs text-gray-500">
                              ${property.monthlyIncome.toLocaleString()} - ${property.expenses.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Settings className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Market Intelligence Integration */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Market Intelligence Alerts
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">River Oaks Market Update</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your River Oaks property has appreciated 8.2% this quarter, outperforming the area average of 5.1%.
                  </p>
                  <button className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors">
                    View Full Analysis
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Rental Market Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Memorial area rents have increased 12% YoY. Consider raising rent on your townhouse property.
                  </p>
                  <button className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                    Calculate New Rent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}