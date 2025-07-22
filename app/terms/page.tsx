'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Users, 
  Lock, 
  AlertTriangle,
  Scale,
  Globe,
  Mail
} from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-600 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Legal Compliance
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto">
              Houston Land Group Development Intelligence Platform
            </p>
            <p className="text-lg text-slate-200 mt-4">
              Last Updated: January 22, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Quick Navigation */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#acceptance" className="text-blue-600 hover:text-blue-800 font-medium">1. Acceptance</a>
              <a href="#services" className="text-blue-600 hover:text-blue-800 font-medium">2. Services</a>
              <a href="#accounts" className="text-blue-600 hover:text-blue-800 font-medium">3. User Accounts</a>
              <a href="#data" className="text-blue-600 hover:text-blue-800 font-medium">4. Data Usage</a>
              <a href="#intellectual" className="text-blue-600 hover:text-blue-800 font-medium">5. Intellectual Property</a>
              <a href="#privacy" className="text-blue-600 hover:text-blue-800 font-medium">6. Privacy</a>
              <a href="#disclaimers" className="text-blue-600 hover:text-blue-800 font-medium">7. Disclaimers</a>
              <a href="#liability" className="text-blue-600 hover:text-blue-800 font-medium">8. Liability</a>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1: Acceptance */}
          <Card id="acceptance" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Houston Land Group Development Intelligence Platform 
                ("Platform", "Service"), you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                These Terms of Service ("Terms") govern your use of our real estate development 
                intelligence platform, market analysis tools, and related services operated by 
                Houston Land Group ("we", "us", "our").
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Description of Services */}
          <Card id="services" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                2. Description of Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our Platform provides real estate development intelligence services including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Real estate market analysis and trends for Harris County and Houston metro area</li>
                  <li>Development opportunity identification and assessment</li>
                  <li>Neighborhood demographic and economic data</li>
                  <li>Investment property recommendations and analysis</li>
                  <li>Market timing and economic indicators</li>
                  <li>AI-powered assistant (Fernando-X) for real estate inquiries</li>
                  <li>Seller tools including instant offers and timeline optimization</li>
                  <li>Developer and project databases</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    All data and analysis provided are for informational purposes only and should not 
                    be considered as professional real estate, legal, or financial advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: User Accounts */}
          <Card id="accounts" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                3. User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To access certain features of our Platform, you may be required to create an account. 
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms 
                or are inactive for extended periods.
              </p>
            </CardContent>
          </Card>

          {/* Section 4: Data Usage and Accuracy */}
          <Card id="data" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                4. Data Usage and Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Data Sources and Accuracy</h4>
                <p className="text-orange-700">
                  Our Platform aggregates data from multiple sources including Harris County Appraisal 
                  District (HCAD), Houston Association of Realtors (HAR), public records, and third-party 
                  data providers. While we strive for accuracy, we cannot guarantee the completeness 
                  or accuracy of all data.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Data Usage Guidelines:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Data is provided for research and analysis purposes only</li>
                <li>Users should verify all information independently before making decisions</li>
                <li>Commercial redistribution of data is prohibited without written consent</li>
                <li>Data should not be used for discriminatory practices</li>
                <li>Users agree to comply with all applicable data protection laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Intellectual Property */}
          <Card id="intellectual" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                5. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Platform and its original content, features, and functionality are owned by 
                Houston Land Group and are protected by international copyright, trademark, 
                patent, trade secret, and other intellectual property laws.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Our Rights Include:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Platform design and functionality</li>
                    <li>• Proprietary algorithms and analysis tools</li>
                    <li>• Fernando-X AI assistant technology</li>
                    <li>• Custom market intelligence reports</li>
                    <li>• Branding and trademarks</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Your License:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Limited, non-exclusive use</li>
                    <li>• Personal or business research only</li>
                    <li>• Cannot sublicense or redistribute</li>
                    <li>• Subject to these Terms</li>
                    <li>• Revocable at our discretion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Privacy */}
          <Card id="privacy" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                6. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, 
                use, and protect your information when you use our Platform.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Data Protection Commitments:</h4>
                <ul className="text-green-700 space-y-2">
                  <li>• We encrypt sensitive data in transit and at rest</li>
                  <li>• We do not sell personal information to third parties</li>
                  <li>• We provide user controls for data access and deletion</li>
                  <li>• We comply with applicable privacy regulations</li>
                  <li>• We conduct regular security audits and assessments</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By using our Platform, you consent to the collection and use of information 
                as outlined in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Disclaimers */}
          <Card id="disclaimers" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                7. Disclaimers and Warranties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">IMPORTANT DISCLAIMERS:</h4>
                <p className="text-red-700 leading-relaxed">
                  THE PLATFORM AND ALL INFORMATION PROVIDED ARE ON AN "AS IS" AND "AS AVAILABLE" BASIS. 
                  WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES 
                  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Specific Disclaimers:</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Market Data:</strong> Real estate markets are volatile and past performance does not guarantee future results</li>
                  <li><strong>Investment Advice:</strong> We do not provide professional investment, legal, or financial advice</li>
                  <li><strong>Property Values:</strong> Estimated values are for informational purposes and may not reflect actual market value</li>
                  <li><strong>Third-Party Data:</strong> We are not responsible for the accuracy of data from external sources</li>
                  <li><strong>System Availability:</strong> We do not guarantee uninterrupted or error-free service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Limitation of Liability */}
          <Card id="liability" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                8. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, HOUSTON LAND GROUP SHALL NOT BE LIABLE 
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                  INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER ECONOMIC 
                  ADVANTAGE, ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for all claims arising from or related to the Platform 
                shall not exceed the amount you paid to us in the twelve (12) months preceding 
                the claim, or $100, whichever is greater.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Questions About These Terms?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 space-y-1 text-blue-700">
                  <p><strong>Email:</strong> legal@houstonlandgroup.com</p>
                  <p><strong>Address:</strong> Houston Land Group, Houston, TX</p>
                  <p><strong>Phone:</strong> Available upon request</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                These Terms of Service are effective as of January 22, 2025 and will remain in effect 
                except with respect to any changes in their provisions in the future, which will be 
                in effect immediately after being posted on this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}