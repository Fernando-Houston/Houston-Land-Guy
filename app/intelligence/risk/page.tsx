'use client';

import { useState, useEffect } from 'react';
// Removed UI component imports to fix build error - using native HTML instead
import { 
  AlertTriangle,
  Shield,
  TrendingDown,
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  BarChart3,
  Activity,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
  Home,
  Waves,
  ThermometerSun
} from 'lucide-react';

interface RiskFactor {
  id: string;
  name: string;
  category: 'market' | 'environmental' | 'financial' | 'regulatory';
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  trend: 'improving' | 'stable' | 'worsening';
  description: string;
  mitigation: string;
  impact: string;
}

interface PropertyRisk {
  address: string;
  neighborhood: string;
  overallRisk: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

interface MarketRisk {
  area: string;
  overallScore: number;
  factors: {
    marketVolatility: number;
    priceDecline: number;
    demandWeakness: number;
    oversupply: number;
    economicShock: number;
  };
}

export default function RiskAnalysis() {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedArea, setSelectedArea] = useState('houston-metro');
  const [timeframe, setTimeframe] = useState('1Y');
  const [riskData, setRiskData] = useState<PropertyRisk[]>([]);
  const [marketRisks, setMarketRisks] = useState<MarketRisk[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockPropertyRisks: PropertyRisk[] = [
      {
        address: '123 Flood Zone Ave, Houston',
        neighborhood: 'Memorial',
        overallRisk: 75,
        riskFactors: [
          {
            id: '1',
            name: 'Flood Risk',
            category: 'environmental',
            level: 'high',
            score: 85,
            trend: 'worsening',
            description: 'Property located in FEMA flood zone AE with 1% annual flood chance',
            mitigation: 'Flood insurance required, consider elevation improvements',
            impact: 'Potential for significant property damage and insurance claims'
          },
          {
            id: '2',
            name: 'Market Volatility',
            category: 'market',
            level: 'medium',
            score: 65,
            trend: 'stable',
            description: 'Memorial area showing moderate price fluctuations',
            mitigation: 'Diversify portfolio across neighborhoods',
            impact: 'Property value may fluctuate 10-15% annually'
          }
        ],
        recommendations: [
          'Obtain comprehensive flood insurance coverage',
          'Consider flood mitigation improvements',
          'Monitor local drainage infrastructure projects'
        ]
      },
      {
        address: '456 Heights Blvd, Houston',
        neighborhood: 'The Heights',
        overallRisk: 45,
        riskFactors: [
          {
            id: '3',
            name: 'Gentrification Risk',
            category: 'market',
            level: 'medium',
            score: 55,
            trend: 'improving',
            description: 'Rapid neighborhood development may price out existing tenants',
            mitigation: 'Monitor rental rates and tenant demographics',
            impact: 'Potential for rent control or zoning restrictions'
          },
          {
            id: '4',
            name: 'Infrastructure Age',
            category: 'regulatory',
            level: 'low',
            score: 35,
            trend: 'stable',
            description: 'Aging water and sewer infrastructure needs updates',
            mitigation: 'Budget for potential special assessments',
            impact: 'Possible infrastructure improvement costs'
          }
        ],
        recommendations: [
          'Stay informed on zoning changes',
          'Build relationships with city planning department',
          'Consider infrastructure upgrade timeline'
        ]
      }
    ];

    const mockMarketRisks: MarketRisk[] = [
      {
        area: 'Houston Metro',
        overallScore: 52,
        factors: {
          marketVolatility: 48,
          priceDecline: 35,
          demandWeakness: 42,
          oversupply: 65,
          economicShock: 55
        }
      },
      {
        area: 'River Oaks',
        overallScore: 35,
        factors: {
          marketVolatility: 25,
          priceDecline: 20,
          demandWeakness: 30,
          oversupply: 45,
          economicShock: 40
        }
      },
      {
        area: 'Energy Corridor',
        overallScore: 68,
        factors: {
          marketVolatility: 75,
          priceDecline: 60,
          demandWeakness: 70,
          oversupply: 65,
          economicShock: 85
        }
      }
    ];

    setTimeout(() => {
      setRiskData(mockPropertyRisks);
      setMarketRisks(mockMarketRisks);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-white/20 text-white border border-white/30 rounded-full">
              AI Risk Intelligence
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Risk Analysis Center
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Comprehensive risk assessment with predictive analytics and mitigation strategies
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Risk Analysis Controls
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                value={selectedArea} 
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="houston-metro">Houston Metro</option>
                <option value="river-oaks">River Oaks</option>
                <option value="memorial">Memorial</option>
                <option value="energy-corridor">Energy Corridor</option>
              </select>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
                <option value="3Y">3 Years</option>
              </select>
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Risk Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Risk Score</p>
                  <p className={`text-2xl font-bold ${getRiskScoreColor(52)}`}>52/100</p>
                  <p className="text-xs text-gray-500 mt-1">Moderate Risk</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Risk Properties</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-xs text-gray-500 mt-1">Require attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Market Volatility</p>
                  <p className="text-2xl font-bold text-yellow-600">48%</p>
                  <p className="text-xs text-gray-500 mt-1">Above average</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Trend</p>
                  <p className="text-2xl font-bold text-green-600">Stable</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">No major changes</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Risk Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Market Risk Factors
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Factor Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Houston Metro Risk Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Market Volatility</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '48%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Price Decline Risk</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Demand Weakness</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '42%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Oversupply Risk</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Economic Shock</span>
                      <span className="text-sm font-medium">55%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '55%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Area Comparison */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Area Risk Comparison</h3>
                <div className="space-y-3">
                  {marketRisks.map((area) => (
                    <div key={area.area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{area.area}</p>
                        <p className="text-sm text-gray-600">Overall Risk Score</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getRiskScoreColor(area.overallScore)}`}>
                          {area.overallScore}
                        </p>
                        <p className="text-xs text-gray-500">
                          {area.overallScore <= 30 ? 'Low' : 
                           area.overallScore <= 60 ? 'Moderate' : 
                           area.overallScore <= 80 ? 'High' : 'Critical'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property-Specific Risks */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Property Risk Assessment
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {riskData.map((property, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{property.address}</h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{property.neighborhood}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Overall Risk</p>
                      <p className={`text-2xl font-bold ${getRiskScoreColor(property.overallRisk)}`}>
                        {property.overallRisk}/100
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Risk Factors</h4>
                      <div className="space-y-3">
                        {property.riskFactors.map((factor) => (
                          <div key={factor.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              {factor.category === 'environmental' ? <Waves className="w-5 h-5 text-blue-600" /> :
                               factor.category === 'market' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                               factor.category === 'financial' ? <DollarSign className="w-5 h-5 text-yellow-600" /> :
                               <Shield className="w-5 h-5 text-purple-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{factor.name}</h5>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(factor.level)}`}>
                                    {factor.level}
                                  </span>
                                  {getTrendIcon(factor.trend)}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                              <div className="text-xs text-gray-500">
                                <p><strong>Impact:</strong> {factor.impact}</p>
                                <p><strong>Mitigation:</strong> {factor.mitigation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {property.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="inline-flex items-center px-3 py-1.5 mr-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Risk Alerts & Monitoring
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">High Flood Risk Alert</h4>
                  <p className="text-sm text-red-700 mt-1">
                    3 properties in your portfolio are in high-risk flood zones. Consider flood insurance review.
                  </p>
                  <button className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors">
                    Review Properties
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Market Volatility Increase</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Energy Corridor showing increased price volatility. Monitor for potential impacts.
                  </p>
                  <button className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors">
                    View Analysis
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Infrastructure Update</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    City planning new drainage improvements in Memorial area. May reduce flood risk.
                  </p>
                  <button className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                    Track Progress
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