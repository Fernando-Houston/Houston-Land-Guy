'use client'

import { useState, useEffect } from 'react'
import MajorProjectsTracker from '@/components/projects/MajorProjectsTracker'
import { Construction, MapPin, DollarSign, Calendar, TrendingUp, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { realDataService } from '@/lib/services/real-data-service'

interface ProjectData {
  id: string
  name: string
  developer: string
  type: string
  value: number
  status: string
  location: string
  description?: string
  completion?: Date
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [projectStats, setProjectStats] = useState({
    totalValue: 13.8,
    activeProjects: 8,
    timelineRange: '2025-2027'
  })

  useEffect(() => {
    loadProjectData()
  }, [])

  const loadProjectData = async () => {
    try {
      const projects = await realDataService.getMajorProjects()
      const totalValue = projects.reduce((sum, p) => sum + p.value, 0)
      const activeCount = projects.filter(p => p.status === 'under-construction').length
      
      setProjectStats({
        totalValue: Math.round(totalValue / 1000000000 * 10) / 10, // Convert to billions
        activeProjects: activeCount || projects.length,
        timelineRange: '2025-2027'
      })
    } catch (error) {
      console.error('Error loading project data:', error)
    }
  }

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProject(project)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Houston Development Pipeline
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Track billions in active development projects shaping Houston's future
            </p>
            
            {/* Real-Time Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Construction className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">${projectStats.totalValue}B</div>
                <div className="text-sm text-purple-200">Total Investment</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Building2 className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{projectStats.activeProjects}</div>
                <div className="text-sm text-purple-200">Active Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{projectStats.timelineRange}</div>
                <div className="text-sm text-purple-200">Completion Timeline</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MajorProjectsTracker 
          onProjectClick={handleProjectClick}
          limit={20}
        />
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h3>
              <p className="text-gray-600 mt-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedProject.location}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Investment</p>
                  <p className="text-xl font-semibold text-purple-600">
                    ${selectedProject.value >= 1000000000 
                      ? (selectedProject.value / 1000000000).toFixed(2) + 'B'
                      : (selectedProject.value / 1000000).toFixed(0) + 'M'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Developer</p>
                  <p className="text-xl font-semibold">{selectedProject.developer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-medium">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Completion</p>
                  <p className="text-lg font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedProject.expectedCompletion}
                  </p>
                </div>
              </div>
              
              {(selectedProject.sqft || selectedProject.units) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Project Size</p>
                  <p className="text-lg">
                    {selectedProject.sqft && `${selectedProject.sqft.toLocaleString()} sqft`}
                    {selectedProject.units && ` • ${selectedProject.units} units`}
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700">{selectedProject.description}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Impact on Houston Market</p>
                <ul className="space-y-2">
                  {selectedProject.investmentAmount > 1000000000 && (
                    <li className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span className="text-sm">Major economic impact with over $1B investment</span>
                    </li>
                  )}
                  {selectedProject.type.includes('Residential') && (
                    <li className="flex items-start">
                      <Building2 className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-sm">Will add significant housing supply to the market</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <Construction className="h-4 w-4 text-orange-600 mr-2 mt-0.5" />
                    <span className="text-sm">Creating construction jobs and boosting local economy</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Track This Project
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}