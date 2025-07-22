'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, DollarSign, Users, Clock, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InstantOfferEngine() {
  const [propertyData, setPropertyData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    propertyType: 'single-family',
    condition: 'good'
  });
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOffers([
        {
          id: 1,
          buyerType: 'Cash Investor',
          offerAmount: 385000,
          closingDays: 7,
          contingencies: ['None'],
          proofOfFunds: true,
          buyerRating: 4.8
        },
        {
          id: 2,
          buyerType: 'International Buyer',
          offerAmount: 378000,
          closingDays: 14,
          contingencies: ['None'],
          proofOfFunds: true,
          buyerRating: 4.5
        },
        {
          id: 3,
          buyerType: 'Traditional Buyer',
          offerAmount: 395000,
          closingDays: 30,
          contingencies: ['Financing', 'Inspection'],
          proofOfFunds: false,
          buyerRating: 4.2
        }
      ]);
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              500+ Pre-Qualified Buyers
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Instant Offer Engine
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get instant cash offers from our network of verified buyers in under 48 hours
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Buyers</p>
                <p className="text-xl font-bold">523</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Cash Offer</p>
                <p className="text-xl font-bold">98.5%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Close Time</p>
                <p className="text-xl font-bold">14 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-xl font-bold">94%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Get Instant Offers</CardTitle>
              <p className="text-gray-600">Enter your property details for immediate cash offers</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="address">Property Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Houston, TX"
                    value={propertyData.address}
                    onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={propertyData.bedrooms}
                      onValueChange={(value) => setPropertyData({...propertyData, bedrooms: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={propertyData.bathrooms}
                      onValueChange={(value) => setPropertyData({...propertyData, bathrooms: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,1.5,2,2.5,3,3.5,4].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    placeholder="2,500"
                    value={propertyData.squareFeet}
                    onChange={(e) => setPropertyData({...propertyData, squareFeet: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={propertyData.propertyType}
                    onValueChange={(value) => setPropertyData({...propertyData, propertyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Property Condition</Label>
                  <Select
                    value={propertyData.condition}
                    onValueChange={(value) => setPropertyData({...propertyData, condition: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs-work">Needs Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Getting Offers...' : 'Get Instant Offers'} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Buyer Network Preview */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Our Buyer Network</CardTitle>
                <p className="text-gray-600">Pre-qualified buyers ready to make offers</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Cash Investors</p>
                        <p className="text-sm text-gray-600">Close in 7-14 days</p>
                      </div>
                    </div>
                    <Badge variant="secondary">186 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Traditional Buyers</p>
                        <p className="text-sm text-gray-600">Pre-approved financing</p>
                      </div>
                    </div>
                    <Badge variant="secondary">237 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">International Buyers</p>
                        <p className="text-sm text-gray-600">All-cash offers</p>
                      </div>
                    </div>
                    <Badge variant="secondary">100 Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Recent Success</p>
                    <p className="text-green-800">
                      "Received 5 cash offers within 24 hours and closed in just 10 days. 
                      The process was incredibly smooth!"
                    </p>
                    <p className="text-sm text-green-700 mt-2">- Sarah M., River Oaks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offers Display */}
        {submitted && offers.length > 0 && (
          <div className="mt-8">
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                🎉 Great news! You have {offers.length} instant offers for your property.
              </AlertDescription>
            </Alert>
            
            <h3 className="text-2xl font-bold mb-4">Your Instant Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">{offer.buyerType}</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${offer.offerAmount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {offer.buyerRating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Closing Time</span>
                      <span className="font-semibold">{offer.closingDays} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Contingencies</span>
                      <span className="font-semibold">{offer.contingencies.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Proof of Funds</span>
                      <span className="font-semibold">{offer.proofOfFunds ? '✓ Yes' : 'Pending'}</span>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700">
                      Accept Offer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}