import { NextRequest, NextResponse } from 'next/server';

interface TimelineTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
}

interface Document {
  name: string;
  required: boolean;
  status: 'missing' | 'uploaded' | 'approved';
  category: string;
}

// Timeline templates based on sale type
const timelineTemplates = {
  traditional: {
    duration: 45,
    name: 'Traditional Sale',
    milestones: [
      { name: 'Listing Ready', days: 7, description: 'Property prepared and marketed' },
      { name: 'First Offers', days: 21, description: 'Initial offers expected' },
      { name: 'Under Contract', days: 30, description: 'Offer accepted, escrow opened' },
      { name: 'Closing', days: 45, description: 'Sale complete, keys transferred' }
    ]
  },
  cash: {
    duration: 21,
    name: 'Cash Sale',
    milestones: [
      { name: 'Property Review', days: 3, description: 'Cash buyer property assessment' },
      { name: 'Offer Received', days: 5, description: 'Cash offer presented' },
      { name: 'Contract Signed', days: 7, description: 'Purchase agreement executed' },
      { name: 'Closing', days: 21, description: 'Fast cash closing complete' }
    ]
  },
  luxury: {
    duration: 75,
    name: 'Luxury Property Sale',
    milestones: [
      { name: 'Professional Marketing', days: 14, description: 'High-end marketing materials created' },
      { name: 'Private Showings', days: 30, description: 'Exclusive buyer tours' },
      { name: 'Offer Negotiation', days: 45, description: 'Premium offer negotiations' },
      { name: 'Due Diligence', days: 60, description: 'Comprehensive inspections' },
      { name: 'Closing', days: 75, description: 'Luxury sale complete' }
    ]
  },
  'new-construction': {
    duration: 60,
    name: 'New Construction Sale',
    milestones: [
      { name: 'Final Inspections', days: 7, description: 'Complete all inspections' },
      { name: 'Marketing Launch', days: 14, description: 'Showcase new construction features' },
      { name: 'Buyer Interest', days: 30, description: 'Generate qualified leads' },
      { name: 'Contract & Warranties', days: 45, description: 'Include builder warranties' },
      { name: 'Closing', days: 60, description: 'New construction sale complete' }
    ]
  }
};

// Task templates organized by week
const tasksByWeek = {
  week1: [
    {
      title: 'Complete Property Disclosure Forms',
      description: 'Fill out all required disclosure documents including known defects, repairs, and material facts',
      priority: 'high' as const,
      category: 'Documentation'
    },
    {
      title: 'Schedule Professional Photography',
      description: 'Book photographer for HDR photos, drone shots, and virtual tour',
      priority: 'high' as const,
      category: 'Marketing'
    },
    {
      title: 'Deep Clean & Declutter',
      description: 'Professional cleaning, remove personal items, organize all spaces',
      priority: 'high' as const,
      category: 'Preparation'
    },
    {
      title: 'Complete Minor Repairs',
      description: 'Fix any obvious issues: leaky faucets, squeaky doors, paint touch-ups',
      priority: 'medium' as const,
      category: 'Preparation'
    }
  ],
  week2: [
    {
      title: 'Review Comparative Market Analysis',
      description: 'Finalize listing price based on recent sales and market conditions',
      priority: 'high' as const,
      category: 'Pricing'
    },
    {
      title: 'Stage Key Rooms',
      description: 'Professional staging for living room, master bedroom, and kitchen',
      priority: 'medium' as const,
      category: 'Preparation'
    },
    {
      title: 'Create Marketing Materials',
      description: 'Design flyers, social media posts, and email campaigns',
      priority: 'medium' as const,
      category: 'Marketing'
    }
  ],
  week3: [
    {
      title: 'Launch MLS Listing',
      description: 'Go live on Multiple Listing Service with professional photos',
      priority: 'high' as const,
      category: 'Marketing'
    },
    {
      title: 'Host Open House',
      description: 'Weekend open house for maximum buyer exposure',
      priority: 'medium' as const,
      category: 'Marketing'
    },
    {
      title: 'Review Initial Feedback',
      description: 'Analyze showing feedback and adjust strategy if needed',
      priority: 'medium' as const,
      category: 'Strategy'
    }
  ],
  week4: [
    {
      title: 'Review & Negotiate Offers',
      description: 'Evaluate all offers with your agent, consider terms beyond price',
      priority: 'high' as const,
      category: 'Negotiation'
    },
    {
      title: 'Accept Offer & Open Escrow',
      description: 'Sign purchase agreement and begin escrow process',
      priority: 'high' as const,
      category: 'Contract'
    }
  ],
  week5: [
    {
      title: 'Buyer Inspections',
      description: 'Coordinate and attend buyer\'s property inspections',
      priority: 'high' as const,
      category: 'Due Diligence'
    },
    {
      title: 'Negotiate Repairs',
      description: 'Review inspection report and negotiate repair requests',
      priority: 'high' as const,
      category: 'Negotiation'
    }
  ],
  week6: [
    {
      title: 'Complete Agreed Repairs',
      description: 'Finish any repairs agreed upon in negotiations',
      priority: 'high' as const,
      category: 'Preparation'
    },
    {
      title: 'Final Walk-Through',
      description: 'Buyer\'s final property inspection before closing',
      priority: 'high' as const,
      category: 'Closing'
    },
    {
      title: 'Closing Day',
      description: 'Sign final documents and transfer ownership',
      priority: 'high' as const,
      category: 'Closing'
    }
  ]
};

// Required documents for sale
const requiredDocuments: Document[] = [
  { name: 'Property Disclosure Statement', required: true, status: 'missing', category: 'Legal' },
  { name: 'Title Documents', required: true, status: 'missing', category: 'Legal' },
  { name: 'HOA Documents', required: false, status: 'missing', category: 'HOA' },
  { name: 'Warranty Information', required: false, status: 'missing', category: 'Property' },
  { name: 'Utility Bills (Last 12 months)', required: true, status: 'missing', category: 'Financial' },
  { name: 'Property Tax Records', required: true, status: 'missing', category: 'Financial' },
  { name: 'Survey/Plot Plan', required: false, status: 'missing', category: 'Property' },
  { name: 'Home Improvement Receipts', required: false, status: 'missing', category: 'Property' },
  { name: 'Mortgage Information', required: true, status: 'missing', category: 'Financial' },
  { name: 'Insurance Documents', required: true, status: 'missing', category: 'Financial' }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { saleType = 'traditional', targetDate } = body;

    // Get template based on sale type
    const template = timelineTemplates[saleType as keyof typeof timelineTemplates] || timelineTemplates.traditional;
    
    // Calculate start date
    const startDate = new Date();
    const endDate = targetDate ? new Date(targetDate) : new Date(startDate.getTime() + template.duration * 24 * 60 * 60 * 1000);
    
    // Generate timeline with tasks
    const timeline = [];
    let taskId = 1;
    
    // Week 1 tasks
    const week1Tasks = tasksByWeek.week1.map(task => ({
      id: String(taskId++),
      ...task,
      dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending' as const
    }));
    timeline.push({ week: 1, tasks: week1Tasks });
    
    // Week 2 tasks
    const week2Tasks = tasksByWeek.week2.map(task => ({
      id: String(taskId++),
      ...task,
      dueDate: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending' as const
    }));
    timeline.push({ week: 2, tasks: week2Tasks });
    
    // Week 3 tasks
    const week3Tasks = tasksByWeek.week3.map(task => ({
      id: String(taskId++),
      ...task,
      dueDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending' as const
    }));
    timeline.push({ week: 3, tasks: week3Tasks });
    
    // Additional weeks based on sale type
    if (template.duration > 21) {
      const week4Tasks = tasksByWeek.week4.map(task => ({
        id: String(taskId++),
        ...task,
        dueDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      }));
      timeline.push({ week: 4, tasks: week4Tasks });
    }
    
    if (template.duration > 35) {
      const week5Tasks = tasksByWeek.week5.map(task => ({
        id: String(taskId++),
        ...task,
        dueDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      }));
      timeline.push({ week: 5, tasks: week5Tasks });
      
      const week6Tasks = tasksByWeek.week6.map(task => ({
        id: String(taskId++),
        ...task,
        dueDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      }));
      timeline.push({ week: 6, tasks: week6Tasks });
    }
    
    // Generate milestones with calculated dates
    const milestones = template.milestones.map(milestone => ({
      name: milestone.name,
      date: new Date(startDate.getTime() + milestone.days * 24 * 60 * 60 * 1000).toISOString(),
      description: milestone.description
    }));
    
    const response = {
      timeline,
      milestones,
      documents: requiredDocuments,
      summary: {
        saleType: template.name,
        totalDuration: template.duration,
        startDate: startDate.toISOString(),
        estimatedClosingDate: endDate.toISOString(),
        totalTasks: timeline.reduce((sum, week) => sum + week.tasks.length, 0),
        criticalTasks: timeline.reduce((sum, week) => 
          sum + week.tasks.filter(task => task.priority === 'high').length, 0
        )
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating timeline:', error);
    return NextResponse.json(
      { error: 'Failed to generate timeline' },
      { status: 500 }
    );
  }
}