import { NextResponse } from 'next/server'
import { realDataService } from '@/lib/services/real-data-service'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    // Get projects from real data service
    const projects = await realDataService.getMajorProjects(
      status ? { status } : undefined
    )
    
    return NextResponse.json({
      success: true,
      projects: projects || [],
      total: projects?.length || 0
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        projects: [],
        total: 0
      },
      { status: 500 }
    )
  }
}