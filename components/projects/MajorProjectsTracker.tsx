'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Construction, MapPin, DollarSign, Calendar, Building2,
  TrendingUp, Clock, Users, AlertCircle, Filter, Search
} from 'lucide-react'

interface MajorProject {
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
import { cn } from '@/lib/utils/cn'

interface MajorProjectsTrackerProps {
  className?: string
  limit?: number
  onProjectClick?: (project: MajorProject) => void
}

export default function MajorProjectsTracker({ 
  className, 
  limit = 10,
  onProjectClick 
}: MajorProjectsTrackerProps) {
  const [projects, setProjects] = useState<MajorProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'all' | MajorProject['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'investment' | 'completion'>('investment')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.developer.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'investment') {
        return b.value - a.value
      } else {
        // Sort by completion date if available, otherwise by name
        if (a.completion && b.completion) {
          return a.completion.getTime() - b.completion.getTime()
        }
        return a.name.localeCompare(b.name)
      }
    })
    .slice(0, limit)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const getStatusColor = (status: MajorProject['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'under_construction': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: MajorProject['status']) => {
    switch (status) {
      case 'planning': return Clock
      case 'approved': return AlertCircle
      case 'under_construction': return Construction
      case 'completed': return Building2
      default: return Building2
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Construction className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading major Houston projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Construction className="h-6 w-6 text-purple-600 mr-2" />
          Major Houston Projects
        </h2>
        <p className="text-gray-600 mt-1">
          Track {formatCurrency(projects.reduce((sum, p) => sum + p.value, 0))} in development across Houston
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, developers, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'planning', 'approved', 'under_construction'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors capitalize',
                selectedStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="investment">Sort by Investment</option>
          <option value="completion">Sort by Completion</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => {
            const StatusIcon = getStatusIcon(project.status)
            
            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => onProjectClick?.(project)}
              >
                {/* Project Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.location}
                      </div>
                    </div>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium flex items-center',
                      getStatusColor(project.status)
                    )}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Investment Amount */}
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(project.value)}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  {/* Developer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Developer</span>
                    <span className="text-sm font-medium text-gray-900">{project.developer}</span>
                  </div>

                  {/* Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900">{project.type}</span>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Description</span>
                      <span className="text-sm font-medium text-gray-900">
                        {project.description.length > 30 
                          ? project.description.substring(0, 30) + '...'
                          : project.description
                        }
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.status.replace('_', ' ').replace('-', ' ')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 pt-2 border-t border-gray-100">
                    {project.description}
                  </p>
                </div>

                {/* Progress Bar (for under construction) */}
                {project.status === 'under_construction' && (
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Construction Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
          <p className="text-sm text-gray-600">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(projects.reduce((sum, p) => sum + p.value, 0))}
          </p>
          <p className="text-sm text-gray-600">Total Investment</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-orange-600">
            {projects.filter(p => p.status === 'under_construction').length}
          </p>
          <p className="text-sm text-gray-600">Under Construction</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">
            {projects.filter(p => p.status === 'planning' || p.status === 'approved').length}
          </p>
          <p className="text-sm text-gray-600">In Pipeline</p>
        </div>
      </div>
    </div>
  )
}