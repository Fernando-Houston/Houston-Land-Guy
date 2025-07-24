'use client';

import { Search, Calculator, FileText, TrendingUp, MapPin, DollarSign, Building2, Zap } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  bgColor: string;
}

export default function QuickActionsWidget() {
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Property Search',
      description: 'Find properties with advanced filters',
      icon: Search,
      href: '/search',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      id: '2',
      title: 'ROI Calculator',
      description: 'Calculate investment returns',
      icon: Calculator,
      href: '/tools/roi-calculator',
      color: 'text-green-600',
      bgColor: 'bg-green-100 hover:bg-green-200'
    },
    {
      id: '3',
      title: 'Market Reports',
      description: 'View latest market intelligence',
      icon: FileText,
      href: '/market-reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 hover:bg-purple-200'
    },
    {
      id: '4',
      title: 'Deal Flow',
      description: 'Browse investment opportunities',
      icon: TrendingUp,
      href: '/intelligence/deal-flow',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 hover:bg-orange-200'
    },
    {
      id: '5',
      title: 'Neighborhood Analysis',
      description: 'Explore Houston neighborhoods',
      icon: MapPin,
      href: '/neighborhoods',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 hover:bg-indigo-200'
    },
    {
      id: '6',
      title: 'Portfolio Tracker',
      description: 'Track your investments',
      icon: DollarSign,
      href: '/intelligence/portfolio',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 hover:bg-emerald-200'
    },
    {
      id: '7',
      title: 'Development Projects',
      description: 'Explore new developments',
      icon: Building2,
      href: '/developers',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 hover:bg-cyan-200'
    },
    {
      id: '8',
      title: 'Market Heat Map',
      description: 'Visual market activity',
      icon: Zap,
      href: '/market-heatmap',
      color: 'text-red-600',
      bgColor: 'bg-red-100 hover:bg-red-200'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <a
                key={action.id}
                href={action.href}
                className={`p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105 ${action.bgColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${action.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{action.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Recently Used */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recently Used</h4>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <Calculator className="w-3 h-3 mr-1" />
              ROI Calculator
            </button>
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <Search className="w-3 h-3 mr-1" />
              Property Search
            </button>
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <TrendingUp className="w-3 h-3 mr-1" />
              Deal Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}