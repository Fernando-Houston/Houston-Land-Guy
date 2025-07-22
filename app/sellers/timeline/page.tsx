'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              AI-Powered Timeline
            </Badge>
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Days to Sell</p>
                <p className="text-xl font-bold">28 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-xl font-bold">2 of 9</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-xl font-bold">5 of 8</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">On Track</p>
                <p className="text-xl font-bold">Yes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Generator */}
        {!timelineGenerated ? (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Generate Your Custom Timeline</CardTitle>
              <p className="text-gray-600">Tell us about your sale to create a personalized timeline</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="saleType">Sale Type</Label>
                  <Select value={saleType} onValueChange={setSaleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Sale (30-45 days)</SelectItem>
                      <SelectItem value="cash">Cash Sale (15-30 days)</SelectItem>
                      <SelectItem value="luxury">Luxury Property (60-90 days)</SelectItem>
                      <SelectItem value="new-construction">New Construction (45-90 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Closing Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={generateTimeline} 
                className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700"
              >
                Generate Timeline <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress Overview */}
            <Card className="shadow-lg mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Overall Progress</CardTitle>
                    <p className="text-gray-600">You're on track to close in 32 days</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    On Schedule
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={overallProgress} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">{overallProgress}% Complete</p>
              </CardContent>
            </Card>

            {/* Timeline and Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Task Timeline */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Your Sale Timeline</CardTitle>
                    <p className="text-gray-600">Tasks organized by week</p>
                  </CardHeader>
                  <CardContent>
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
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getPriorityColor(task.priority)}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Milestones */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Key Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                {/* Document Checklist */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Document Checklist</CardTitle>
                    <p className="text-sm text-gray-600">5 of 8 complete</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className={doc.status === 'uploaded' ? 'text-gray-500 line-through' : ''}>
                            {doc.name}
                          </span>
                          {doc.status === 'uploaded' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Badge variant="outline" className="text-xs">Missing</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Upload Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Next Steps Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Next Steps</AlertTitle>
              <AlertDescription className="text-blue-800">
                Complete deep cleaning this week and schedule your staging consultation. 
                These tasks are critical for your listing launch next week.
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  );
}