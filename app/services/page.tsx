import { Calculator, TrendingUp, Map, BarChart3, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      icon: Calculator,
      title: "ROI Analysis Tools",
      description: "Advanced calculators for analyzing potential returns on Houston development projects with real-time market data.",
      features: [
        "Construction cost estimation",
        "Revenue projections",
        "Market comp analysis",
        "Risk assessment"
      ],
      cta: "Try ROI Calculator",
      link: "/roi-calculator"
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence Reports",
      description: "Comprehensive market analysis and trends for Houston neighborhoods and submarkets.",
      features: [
        "Neighborhood profiles",
        "Price trend analysis",
        "Demand indicators",
        "Competition analysis"
      ],
      cta: "View Sample Report",
      link: "/intelligence"
    },
    {
      icon: Map,
      title: "Zoning & Regulatory Analysis",
      description: "Navigate Houston's development regulations with our comprehensive zoning tools.",
      features: [
        "Interactive zoning maps",
        "Permitting requirements",
        "Development restrictions",
        "Opportunity zones"
      ],
      cta: "Coming Soon",
      link: "#",
      disabled: true
    },
    {
      icon: DollarSign,
      title: "Financing Solutions",
      description: "Connect with lenders and explore financing options tailored for Houston developers.",
      features: [
        "Lender matching",
        "Rate comparisons",
        "Loan calculators",
        "Pre-qualification tools"
      ],
      cta: "Coming Soon",
      link: "#",
      disabled: true
    },
    {
      icon: BarChart3,
      title: "Custom Market Research",
      description: "Tailored research and analysis for your specific development needs.",
      features: [
        "Site-specific analysis",
        "Feasibility studies",
        "Market positioning",
        "Competitive advantages"
      ],
      cta: "Request Consultation",
      link: "/consultation"
    },
    {
      icon: FileText,
      title: "Development Consulting",
      description: "Expert guidance from experienced Houston development professionals.",
      features: [
        "Project planning",
        "Risk mitigation",
        "Market entry strategy",
        "Partnership opportunities"
      ],
      cta: "Schedule Meeting",
      link: "/consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive tools and insights designed specifically for Houston's 
            small-to-medium builders and developers.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-green-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {service.disabled ? (
                      <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
                        {service.cta}
                      </div>
                    ) : (
                      <Link
                        href={service.link}
                        className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                      >
                        {service.cta}
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our team can help you identify the right tools for your project.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}