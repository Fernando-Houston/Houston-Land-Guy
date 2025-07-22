'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
        return <Badge className="bg-green-100 text-green-800">Owned</Badge>;
      case 'under_contract':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Contract</Badge>;
      case 'sold':
        return <Badge className="bg-gray-100 text-gray-800">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              AI-Powered Analytics
            </Badge>
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Performance Chart */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Portfolio Performance
                </CardTitle>
                <div className="flex gap-2">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedTimeframe === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive performance chart</p>
                  <p className="text-sm text-gray-500">Showing portfolio value over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Distribution */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Property Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Single Family</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <Progress value={33.3} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Townhouse</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <Progress value={33.3} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Condo</span>
                    <span className="text-sm font-medium">33.3%</span>
                  </div>
                  <Progress value={33.3} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property List */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Portfolio Properties
              </CardTitle>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Market Intelligence Integration */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Market Intelligence Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">River Oaks Market Update</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your River Oaks property has appreciated 8.2% this quarter, outperforming the area average of 5.1%.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-yellow-700 border-yellow-300">
                    View Full Analysis
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Rental Market Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Memorial area rents have increased 12% YoY. Consider raising rent on your townhouse property.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-700 border-blue-300">
                    Calculate New Rent
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}