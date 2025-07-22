'use client';

import { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Home, 
  DollarSign,
  AlertCircle,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';

interface TimelineTask {
  id: string;
  title: string;
  description: string;
  week: number;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
  icon: any;
}

export default function SaleTimelineOptimizer() {
  const [saleType, setSaleType] = useState('traditional');
  const [targetDate, setTargetDate] = useState('');
  const [timelineGenerated, setTimelineGenerated] = useState(false);
  const [overallProgress, setOverallProgress] = useState(35);

  const tasks: TimelineTask[] = [
    // Week 1
    {
      id: '1',
      title: 'Complete Property Disclosure Forms',
      description: 'Fill out all required disclosure documents',
      week: 1,
      status: 'completed',
      priority: 'high',
      category: 'Documentation'
    },
    {
      id: '2',
      title: 'Schedule Professional Photography',
      description: 'Book photographer for listing photos',
      week: 1,
      status: 'completed',
      priority: 'high',
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'Deep Clean & Declutter',
      description: 'Prepare home for showings',
      week: 1,
      status: 'in_progress',
      priority: 'high',
      category: 'Preparation'
    },
    // Week 2
    {
      id: '4',
      title: 'Review Comparative Market Analysis',
      description: 'Finalize listing price strategy',
      week: 2,
      status: 'pending',
      priority: 'high',
      category: 'Pricing'
    },
    {
      id: '5',
      title: 'Stage Key Rooms',
      description: 'Stage living room, master bedroom, kitchen',
      week: 2,
      status: 'pending',
      priority: 'medium',
      category: 'Preparation'
    },
    // Week 3
    {
      id: '6',
      title: 'Launch MLS Listing',
      description: 'Go live on Multiple Listing Service',
      week: 3,
      status: 'pending',
      priority: 'high',
      category: 'Marketing'
    },
    {
      id: '7',
      title: 'Host Open House',
      description: 'Weekend open house for buyers',
      week: 3,
      status: 'pending',
      priority: 'medium',
      category: 'Marketing'
    },
    // Week 4+
    {
      id: '8',
      title: 'Review & Negotiate Offers',
      description: 'Evaluate incoming offers with agent',
      week: 4,
      status: 'pending',
      priority: 'high',
      category: 'Negotiation'
    },
    {
      id: '9',
      title: 'Accept Offer & Open Escrow',
      description: 'Finalize terms and begin escrow',
      week: 4,
      status: 'pending',
      priority: 'high',
      category: 'Contract'
    }
  ];

  const milestones: Milestone[] = [
    {
      name: 'Listing Ready',
      date: '7 days',
      description: 'Property prepared and marketed',
      icon: Home
    },
    {
      name: 'First Offers',
      date: '14-21 days',
      description: 'Initial offers expected',
      icon: FileText
    },
    {
      name: 'Under Contract',
      date: '30 days',
      description: 'Offer accepted, escrow opened',
      icon: DollarSign
    },
    {
      name: 'Closing',
      date: '45-60 days',
      description: 'Sale complete, keys transferred',
      icon: CheckCircle2
    }
  ];

  const documents = [
    { name: 'Property Disclosure Statement', status: 'uploaded' },
    { name: 'Title Documents', status: 'uploaded' },
    { name: 'HOA Documents', status: 'missing' },
    { name: 'Warranty Information', status: 'missing' },
    { name: 'Utility Bills (Last 12 months)', status: 'uploaded' },
    { name: 'Tax Records', status: 'uploaded' },
    { name: 'Survey/Plot Plan', status: 'missing' },
    { name: 'Repair Receipts', status: 'uploaded' }
  ];

  const generateTimeline = () => {
    setTimelineGenerated(true);
  };

  const getTasksByWeek = (week: number) => {
    return tasks.filter(task => task.week === week);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-sm font-medium text-white">AI-Powered Timeline</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sale Timeline Optimizer
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              AI-generated selling timeline with task management and milestone tracking
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-0 shadow-lg rounded-xl">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Days to Sell</p>
                <p className="text-xl font-bold">28 Days</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg rounded-xl">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-xl font-bold">2 of 9</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg rounded-xl">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-xl font-bold">5 of 8</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-0 shadow-lg rounded-xl">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">On Track</p>
                <p className="text-xl font-bold">Yes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Generator */}
        {!timelineGenerated ? (
          <div className="bg-white shadow-lg mb-8 rounded-xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Generate Your Custom Timeline</h2>
              <p className="text-gray-600">Tell us about your sale to create a personalized timeline</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="saleType">Sale Type</label>
                  <select
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="traditional">Traditional Sale (30-45 days)</option>
                    <option value="cash">Cash Sale (15-30 days)</option>
                    <option value="luxury">Luxury Property (60-90 days)</option>
                    <option value="new-construction">New Construction (45-90 days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="targetDate">Target Closing Date</label>
                  <input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button 
                onClick={generateTimeline} 
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center"
              >
                Generate Timeline <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="bg-white shadow-lg mb-8 rounded-xl">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
                    <p className="text-gray-600">You're on track to close in 32 days</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-600 border border-green-600">
                    On Schedule
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-purple-600 h-3 rounded-full" style={{width: `${overallProgress}%`}}></div>
                </div>
                <p className="text-sm text-gray-600">{overallProgress}% Complete</p>
              </div>
            </div>

            {/* Timeline and Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Task Timeline */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-lg rounded-xl">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Your Sale Timeline</h2>
                    <p className="text-gray-600">Tasks organized by week</p>
                  </div>
                  <div className="p-6">
                    {[1, 2, 3, 4].map((week) => (
                      <div key={week} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Week {week}
                        </h4>
                        <div className="space-y-3">
                          {getTasksByWeek(week).map((task) => (
                            <div
                              key={task.id}
                              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className={`font-medium ${
                                    task.status === 'completed' ? 'text-gray-500 line-through' : ''
                                  }`}>
                                    {task.title}
                                  </p>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-xl">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Key Milestones</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <milestone.icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{milestone.name}</p>
                            <p className="text-sm text-gray-600">{milestone.date}</p>
                            <p className="text-xs text-gray-500">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="bg-white shadow-lg rounded-xl">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Document Checklist</h2>
                    <p className="text-sm text-gray-600">5 of 8 complete</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className={doc.status === 'uploaded' ? 'text-gray-500 line-through' : ''}>
                            {doc.name}
                          </span>
                          {doc.status === 'uploaded' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border text-gray-500 border-gray-300">Missing</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Upload Documents
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-900 font-medium mb-1">Next Steps</h3>
                <p className="text-blue-800">
                  Complete deep cleaning this week and schedule your staging consultation. 
                  These tasks are critical for your listing launch next week.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}