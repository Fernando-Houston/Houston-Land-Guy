'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  TrendingUp, 
  MapPin,
  DollarSign,
  Clock,
  Target,
  Star,
  Eye,
  Heart,
  AlertCircle,
  Zap,
  BarChart3,
  Home,
  Building2,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface DealOpportunity {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  estimatedValue: number;
  dealScore: number;
  roi: number;
  propertyType: string;
  status: 'new' | 'hot' | 'under_review' | 'expired';
  daysOnMarket: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  insights: string[];
  matchScore: number;
}

interface SearchCriteria {
  minPrice: string;
  maxPrice: string;
  neighborhood: string;
  propertyType: string;
  minROI: string;
  dealScore: string;
}

export default function DealFlowAutomation() {
  const [deals, setDeals] = useState<DealOpportunity[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealOpportunity[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    minPrice: '',
    maxPrice: '',
    neighborhood: '',
    propertyType: '',
    minROI: '',
    dealScore: ''
  });
  const [automationActive, setAutomationActive] = useState(true);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockDeals: DealOpportunity[] = [
      {
        id: '1',
        address: '1234 Heights Blvd, Houston',
        neighborhood: 'The Heights',
        price: 425000,
        estimatedValue: 485000,
        dealScore: 92,
        roi: 14.1,
        propertyType: 'Single Family',
        status: 'hot',
        daysOnMarket: 3,
        sqft: 1850,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Charming bungalow in prime Heights location. Recent renovations, walk to restaurants.',
        insights: ['Below market value', 'High rental demand area', 'Recent comparable at $510k'],
        matchScore: 89
      },
      {
        id: '2',
        address: '5678 Memorial Dr, Houston',
        neighborhood: 'Memorial',
        price: 675000,
        estimatedValue: 725000,
        dealScore: 88,
        roi: 7.4,
        propertyType: 'Townhouse',
        status: 'new',
        daysOnMarket: 1,
        sqft: 2400,
        bedrooms: 3,
        bathrooms: 2.5,
        description: 'Modern townhouse with premium finishes. Gated community with amenities.',
        insights: ['New construction', 'Premium location', 'High appreciation potential'],
        matchScore: 85
      },
      {
        id: '3',
        address: '910 Main St, Houston',
        neighborhood: 'Midtown',
        price: 385000,
        estimatedValue: 420000,
        dealScore: 85,
        roi: 9.1,
        propertyType: 'Condo',
        status: 'under_review',
        daysOnMarket: 7,
        sqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        description: 'High-rise condo with city views. Building amenities include pool and gym.',
        insights: ['Urban location', 'Good rental potential', 'Building appreciation trend'],
        matchScore: 82
      },
      {
        id: '4',
        address: '2468 River Oaks Blvd, Houston',
        neighborhood: 'River Oaks',
        price: 1250000,
        estimatedValue: 1350000,
        dealScore: 79,
        roi: 8.0,
        propertyType: 'Single Family',
        status: 'new',
        daysOnMarket: 2,
        sqft: 3500,
        bedrooms: 4,
        bathrooms: 3.5,
        description: 'Luxury home in prestigious River Oaks. Recently updated with modern amenities.',
        insights: ['Luxury market', 'Stable appreciation', 'Prime location'],
        matchScore: 78
      },
      {
        id: '5',
        address: '1357 Oak Forest Dr, Houston',
        neighborhood: 'Oak Forest',
        price: 315000,
        estimatedValue: 340000,
        dealScore: 76,
        roi: 7.9,
        propertyType: 'Single Family',
        status: 'expired',
        daysOnMarket: 45,
        sqft: 1650,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Traditional home on large lot. Needs minor updates but good bones.',
        insights: ['Price reduction likely', 'Good flip potential', 'Motivated seller'],
        matchScore: 74
      }
    ];

    setTimeout(() => {
      setDeals(mockDeals);
      setFilteredDeals(mockDeals);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDealScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFilterChange = (key: keyof SearchCriteria, value: string) => {
    const newCriteria = { ...searchCriteria, [key]: value };
    setSearchCriteria(newCriteria);
    
    // Apply filters
    let filtered = [...deals];
    
    if (newCriteria.minPrice) {
      filtered = filtered.filter(deal => deal.price >= parseInt(newCriteria.minPrice));
    }
    if (newCriteria.maxPrice) {
      filtered = filtered.filter(deal => deal.price <= parseInt(newCriteria.maxPrice));
    }
    if (newCriteria.neighborhood) {
      filtered = filtered.filter(deal => deal.neighborhood === newCriteria.neighborhood);
    }
    if (newCriteria.propertyType) {
      filtered = filtered.filter(deal => deal.propertyType === newCriteria.propertyType);
    }
    if (newCriteria.minROI) {
      filtered = filtered.filter(deal => deal.roi >= parseFloat(newCriteria.minROI));
    }
    if (newCriteria.dealScore) {
      filtered = filtered.filter(deal => deal.dealScore >= parseInt(newCriteria.dealScore));
    }
    
    setFilteredDeals(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              AI-Powered Deal Discovery
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Deal Flow Automation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Automated deal sourcing with AI-powered market intelligence and scoring
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Control Panel */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Deal Flow Control
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Automation</span>
                  <Button
                    variant={automationActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutomationActive(!automationActive)}
                    className="flex items-center gap-2"
                  >
                    {automationActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {automationActive ? 'Active' : 'Paused'}
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Input
                placeholder="Min Price"
                value={searchCriteria.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                placeholder="Max Price"
                value={searchCriteria.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
              <Select value={searchCriteria.neighborhood} onValueChange={(value) => handleFilterChange('neighborhood', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Neighborhoods</SelectItem>
                  <SelectItem value="The Heights">The Heights</SelectItem>
                  <SelectItem value="Memorial">Memorial</SelectItem>
                  <SelectItem value="River Oaks">River Oaks</SelectItem>
                  <SelectItem value="Midtown">Midtown</SelectItem>
                  <SelectItem value="Oak Forest">Oak Forest</SelectItem>
                </SelectContent>
              </Select>
              <Select value={searchCriteria.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Min ROI %"
                value={searchCriteria.minROI}
                onChange={(e) => handleFilterChange('minROI', e.target.value)}
              />
              <Input
                placeholder="Min Deal Score"
                value={searchCriteria.dealScore}
                onChange={(e) => handleFilterChange('dealScore', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Deal Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(filteredDeals.reduce((sum, deal) => sum + deal.dealScore, 0) / filteredDeals.length || 0).toFixed(0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg ROI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(filteredDeals.reduce((sum, deal) => sum + deal.roi, 0) / filteredDeals.length || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hot Deals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredDeals.filter(deal => deal.status === 'hot').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{deal.address}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{deal.neighborhood}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(deal.status)}>
                    {deal.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price and Value */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">List Price</p>
                    <p className="text-xl font-bold text-gray-900">${deal.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Est. Value</p>
                    <p className="text-lg font-semibold text-green-600">${deal.estimatedValue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Deal Metrics */}
                <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Deal Score</p>
                    <p className={`text-lg font-bold ${getDealScoreColor(deal.dealScore)}`}>
                      {deal.dealScore}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Est. ROI</p>
                    <p className="text-lg font-bold text-gray-900">{deal.roi.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Match</p>
                    <p className="text-lg font-bold text-blue-600">{deal.matchScore}%</p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{deal.propertyType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">{deal.sqft.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bed/Bath</span>
                    <span className="font-medium">{deal.bedrooms} bed, {deal.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Days on Market</span>
                    <span className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {deal.daysOnMarket} days
                    </span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    AI Insights
                  </h4>
                  <div className="space-y-1">
                    {deal.insights.slice(0, 2).map((insight, index) => (
                      <p key={index} className="text-xs text-blue-800">• {insight}</p>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No deals found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or wait for new deals to be discovered.
              </p>
              <Button variant="outline" className="mt-4">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}