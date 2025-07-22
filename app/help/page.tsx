'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Book,
  Users,
  TrendingUp,
  MapPin,
  Calculator,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    // Getting Started
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I get started with the Houston Land Group platform?',
      answer: 'Getting started is easy! Simply create a free account, complete your profile with your investment preferences, and start exploring our market intelligence tools. You can access neighborhood data, development opportunities, and use Fernando-X our AI assistant for personalized guidance.',
      tags: ['account', 'registration', 'getting started']
    },
    {
      id: '2',
      category: 'Getting Started',
      question: 'What information do I need to provide during registration?',
      answer: 'You\'ll need a valid email address, your name, and information about your role (investor, developer, agent, etc.). Optionally, you can provide your company information and investment preferences to get personalized recommendations.',
      tags: ['registration', 'account setup', 'profile']
    },
    {
      id: '3',
      category: 'Getting Started',
      question: 'Is there a cost to use the platform?',
      answer: 'We offer both free and premium tiers. The free tier includes basic market data and limited AI assistant usage. Premium features include advanced analytics, priority support, and unlimited Fernando-X conversations.',
      tags: ['pricing', 'free tier', 'premium']
    },

    // Data & Analytics
    {
      id: '4',
      category: 'Data & Analytics',
      question: 'Where does your market data come from?',
      answer: 'Our data comes from multiple authoritative sources including Harris County Appraisal District (HCAD), Houston Association of Realtors (HAR) MLS, census data, permit records, and proprietary market research. Data is updated regularly to ensure accuracy.',
      tags: ['data sources', 'HCAD', 'HAR', 'accuracy']
    },
    {
      id: '5',
      category: 'Data & Analytics',
      question: 'How often is the data updated?',
      answer: 'Market data is updated weekly, with some datasets refreshed daily. Property values and sales data are updated as new information becomes available from MLS and county records. You can see the last update date on each data visualization.',
      tags: ['data updates', 'frequency', 'real-time']
    },
    {
      id: '6',
      category: 'Data & Analytics',
      question: 'Can I export data and reports?',
      answer: 'Yes! Premium users can export market reports, property data, and analytics in PDF, Excel, and CSV formats. Free users have limited export capabilities.',
      tags: ['export', 'reports', 'PDF', 'Excel']
    },

    // Fernando-X AI Assistant
    {
      id: '7',
      category: 'Fernando-X',
      question: 'What is Fernando-X and how can it help me?',
      answer: 'Fernando-X is our AI-powered real estate assistant trained on Houston market data. It can help you find investment opportunities, analyze neighborhoods, understand market trends, calculate ROI, and answer questions about Houston real estate development.',
      tags: ['Fernando-X', 'AI assistant', 'investment', 'analysis']
    },
    {
      id: '8',
      category: 'Fernando-X',
      question: 'What types of questions can I ask Fernando-X?',
      answer: 'You can ask about property values, neighborhood comparisons, investment strategies, market trends, zoning information, development costs, and much more. Try questions like "What are the best investment areas in Houston?" or "Compare River Oaks to Memorial neighborhoods".',
      tags: ['Fernando-X', 'questions', 'capabilities']
    },
    {
      id: '9',
      category: 'Fernando-X',
      question: 'Is there a limit to how many questions I can ask?',
      answer: 'Free users can ask up to 25 questions per month. Premium users have unlimited access to Fernando-X with priority response times and advanced analytical capabilities.',
      tags: ['Fernando-X', 'limits', 'premium', 'usage']
    },

    // Tools & Features
    {
      id: '10',
      category: 'Tools & Features',
      question: 'How do I use the Investment Opportunity Finder?',
      answer: 'Navigate to the Opportunity Finder tool, set your criteria (budget, area, property type, expected ROI), and the system will show matching opportunities. You can save searches and get alerts when new opportunities match your criteria.',
      tags: ['opportunity finder', 'investment', 'search', 'alerts']
    },
    {
      id: '11',
      category: 'Tools & Features',
      question: 'What is the Instant Offer Engine for sellers?',
      answer: 'The Instant Offer Engine connects sellers with our network of 580+ pre-qualified buyers. Enter your property details and receive multiple cash offers within 48 hours from investors, iBuyers, and traditional buyers.',
      tags: ['instant offers', 'sellers', 'cash offers', 'buyers']
    },
    {
      id: '12',
      category: 'Tools & Features',
      question: 'How accurate are the ROI calculations?',
      answer: 'Our ROI calculations use real market data and standard real estate investment formulas. However, they are estimates for educational purposes. Always conduct your own due diligence and consult with professionals before making investment decisions.',
      tags: ['ROI', 'calculations', 'accuracy', 'estimates']
    },

    // Technical Support
    {
      id: '13',
      category: 'Technical Support',
      question: 'The platform is loading slowly. What should I do?',
      answer: 'Try refreshing your browser, clearing your cache, or switching to a different browser. If issues persist, check your internet connection or contact our support team. Our platform works best on modern browsers like Chrome, Firefox, Safari, and Edge.',
      tags: ['performance', 'slow loading', 'browser', 'technical']
    },
    {
      id: '14',
      category: 'Technical Support',
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link within a few minutes. If you don\'t see the email, check your spam folder.',
      tags: ['password', 'reset', 'login', 'email']
    },
    {
      id: '15',
      category: 'Technical Support',
      question: 'Can I use the platform on my mobile device?',
      answer: 'Yes! Our platform is fully responsive and optimized for mobile devices. You can access all features through your mobile browser. We\'re also working on dedicated mobile apps for iOS and Android.',
      tags: ['mobile', 'responsive', 'app', 'accessibility']
    },

    // Account & Billing
    {
      id: '16',
      category: 'Account & Billing',
      question: 'How do I upgrade to a premium account?',
      answer: 'Visit your account settings and click "Upgrade to Premium". Choose your plan and complete the payment process. Premium features are activated immediately after successful payment.',
      tags: ['upgrade', 'premium', 'billing', 'payment']
    },
    {
      id: '17',
      category: 'Account & Billing',
      question: 'Can I cancel my premium subscription anytime?',
      answer: 'Yes, you can cancel your premium subscription at any time from your account settings. You\'ll continue to have premium access until the end of your current billing period.',
      tags: ['cancel', 'subscription', 'billing', 'premium']
    },
    {
      id: '18',
      category: 'Account & Billing',
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for premium subscriptions. If you\'re not satisfied within the first 30 days, contact our support team for a full refund.',
      tags: ['refunds', 'money-back', 'guarantee', 'premium']
    }
  ];

  const categories = ['all', 'Getting Started', 'Data & Analytics', 'Fernando-X', 'Tools & Features', 'Technical Support', 'Account & Billing'];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? '' : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              24/7 Support Available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help & Support Center
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get help with Houston Land Group's development intelligence platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Chat with Fernando-X</h3>
              <p className="text-sm text-gray-600">Get instant help from our AI assistant</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">support@houstonlandgroup.com</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600">Available for premium users</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">Comprehensive user guides</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Categories */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-gray-600">Search our knowledge base or browse by category</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for help articles, features, or common issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Items */}
          <div className="lg:col-span-2 space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or browse a different category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="shadow-lg">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/getting-started" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Getting Started Guide
                </a>
                <a href="/fernando-x" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Fernando-X Tutorial
                </a>
                <a href="/api-docs" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Documentation
                </a>
                <a href="/video-tutorials" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Video Tutorials
                </a>
              </CardContent>
            </Card>

            {/* Platform Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Platform Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">All Systems</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Updates</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fernando-X</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">< 2s</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Response Time: < 4 hours
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Expert Real Estate Team
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}