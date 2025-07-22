'use client';

import { useState } from 'react';
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

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState('');

  const faqData: FAQItem[] = [
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I get started with the Houston Development Intelligence Platform?',
      answer: 'Welcome! Start by exploring the Intelligence Dashboard for market overview, then try our seller tools for property analysis. Fernando-X, our AI assistant, is available 24/7 to guide you through any feature.',
      tags: ['getting started', 'dashboard', 'overview']
    },
    {
      id: '2',
      category: 'Getting Started',
      question: 'What data sources do you use for market intelligence?',
      answer: 'We aggregate data from Harris County Appraisal District (HCAD), Houston Association of Realtors (HAR), public records, construction permits, demographic data, and economic indicators to provide comprehensive market intelligence.',
      tags: ['data sources', 'HCAD', 'HAR', 'market data']
    },
    {
      id: '3',
      category: 'Fernando-X',
      question: 'What can Fernando-X help me with?',
      answer: 'Fernando-X can assist with market analysis, property valuations, neighborhood insights, investment opportunities, development trends, and general real estate questions specific to the Houston market.',
      tags: ['AI assistant', 'fernando-x', 'help', 'features']
    },
    {
      id: '4',
      category: 'Fernando-X',
      question: 'How accurate is Fernando-X?',
      answer: 'Fernando-X uses real-time data and advanced AI models trained on Houston market data. While highly accurate for general guidance, always verify important decisions with licensed professionals.',
      tags: ['accuracy', 'AI', 'reliability']
    },
    {
      id: '5',
      category: 'Tools & Features',
      question: 'How does the Instant Offer Engine work?',
      answer: 'Our Instant Offer Engine connects you with 500+ pre-qualified buyers. Enter your property details, and receive competitive cash offers within 48 hours from verified buyers.',
      tags: ['instant offers', 'sellers', 'cash offers']
    },
    {
      id: '6',
      category: 'Tools & Features',
      question: 'What is the Buyer Demand Heat Map?',
      answer: 'The Heat Map shows real-time buyer activity across Houston neighborhoods, including search volumes, price ranges, and demand intensity to help time your listings and price competitively.',
      tags: ['demand', 'heat map', 'buyers', 'market timing']
    },
    {
      id: '7',
      category: 'Data & Analytics',
      question: 'How often is the data updated?',
      answer: 'Market data updates daily, MLS data refreshes hourly, and demographic/economic indicators update monthly. Real-time metrics like buyer searches update continuously.',
      tags: ['data updates', 'frequency', 'real-time']
    },
    {
      id: '8',
      category: 'Data & Analytics',
      question: 'Can I export data for my own analysis?',
      answer: 'Yes, most reports include export options (PDF, Excel, CSV). Custom data exports are available for premium users. Contact support for enterprise data licensing.',
      tags: ['export', 'data download', 'reports']
    },
    {
      id: '9',
      category: 'Technical Support',
      question: 'The platform is loading slowly. What should I do?',
      answer: 'Try refreshing the page, clearing browser cache, or using a different browser. For persistent issues, check our status page or contact support with your browser and device details.',
      tags: ['performance', 'loading', 'technical issues']
    },
    {
      id: '10',
      category: 'Account & Billing',
      question: 'How do I upgrade my account?',
      answer: 'Visit your Account Settings to view available plans and upgrade options. Premium features include advanced analytics, custom reports, and priority support.',
      tags: ['upgrade', 'billing', 'premium', 'account']
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
            <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-sm font-medium text-white">24/7 Support Available</span>
            </div>
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
          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Chat with Fernando-X</h3>
              <p className="text-sm text-gray-600">Get instant help from our AI assistant</p>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">support@houstonlandgroup.com</p>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600">Available upon request</p>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">Comprehensive guides & tutorials</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mt-1">{filteredFAQs.length} articles found</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="mt-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <div className="bg-white shadow-lg rounded-xl">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">Popular Topics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Market Analysis Basics
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4 mr-2" />
                    Understanding Heat Maps
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <Calculator className="w-4 h-4 mr-2" />
                    Property Valuation Guide
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <Users className="w-4 h-4 mr-2" />
                    Working with Buyers
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Need More Help?</h3>
              <p className="text-blue-800 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Fernando-X
                </button>
                <a 
                  href="mailto:support@houstonlandgroup.com"
                  className="w-full px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white shadow-lg rounded-xl">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Platform Status</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Updates</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Normal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fernando-X AI</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <a href="#" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-4">
                  View detailed status
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}