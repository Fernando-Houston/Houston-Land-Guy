import { Building2, Users, TrendingUp, Award, Brain, Database, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Houston Development Intelligence Hub</h1>
          <p className="text-xl max-w-3xl">
            The most advanced AI-powered real estate intelligence platform for Houston. Featuring Fernando-X AI assistant, 
            real-time market analytics, and predictive insights for developers, sellers, and investors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                Houston Development Intelligence Hub revolutionizes how real estate professionals access and utilize 
                market intelligence. Our AI-powered platform, featuring Fernando-X, provides instant insights, 
                predictive analytics, and real-time data that was previously available only to enterprise-level 
                organizations.
              </p>
              <p className="text-lg text-gray-600">
                We combine artificial intelligence, machine learning, and comprehensive data analysis to deliver 
                actionable intelligence that helps developers, sellers, and investors make smarter decisions 
                faster than ever before in Houston's dynamic real estate market.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Expertise</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">1.2M+ Data Points</h3>
                    <p className="text-gray-600">Comprehensive real-time Houston market intelligence</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Fernando-X AI Assistant</h3>
                    <p className="text-gray-600">24/7 AI expert trained on Houston-specific data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">892+ Daily AI Insights</h3>
                    <p className="text-gray-600">Continuous intelligence generation and analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h3>
                <p className="text-gray-600">
                  Fernando-X and advanced AI algorithms provide instant analysis and predictive insights.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Data</h3>
                <p className="text-gray-600">
                  Live market data, permit tracking, and instant updates from multiple Houston sources.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bank-Grade Security</h3>
                <p className="text-gray-600">
                  Enterprise-level security ensures your data and insights remain confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Access Houston's Most Advanced Intelligence Platform?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the AI revolution in Houston real estate. Start with Fernando-X today.
          </p>
          <a
            href="/consultation"
            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Get Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
}