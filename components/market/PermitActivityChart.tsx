'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Factory, Briefcase } from 'lucide-react'
import { PermitActivity } from '@/lib/core-agents/types'

interface PermitActivityChartProps {
  permitData: PermitActivity
  className?: string
}

export function PermitActivityChart({ permitData, className = '' }: PermitActivityChartProps) {
  const permitTypes = [
    { 
      name: 'Residential', 
      icon: Home, 
      data: permitData.residential, 
      color: 'green',
      gradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    { 
      name: 'Commercial', 
      icon: Building2, 
      data: permitData.commercial, 
      color: 'blue',
      gradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'Industrial', 
      icon: Factory, 
      data: permitData.industrial, 
      color: 'purple',
      gradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'Mixed-Use', 
      icon: Briefcase, 
      data: permitData.mixedUse, 
      color: 'orange',
      gradient: 'from-orange-50 to-red-50',
      iconColor: 'text-orange-600'
    }
  ]

  const maxValue = Math.max(...permitTypes.map(t => t.data.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Permit Activity</h3>
        <div className="text-sm text-gray-600">
          Total: ${(permitData.totalValue / 1000000).toFixed(1)}M
        </div>
      </div>

      <div className="space-y-4">
        {permitTypes.map((type, index) => {
          const Icon = type.icon
          const percentage = (type.data.value / maxValue) * 100
          
          return (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${type.gradient} rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 ${type.iconColor} mr-2`} />
                  <span className="font-medium text-gray-900">{type.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    ${(type.data.value / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">{type.data.count} permits</div>
                </div>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className={`h-2 rounded-full bg-${type.color}-600`}
                  style={{ background: `var(--${type.color}-600)` }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {permitData.topProjects.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Top Projects</h4>
          <div className="space-y-2">
            {permitData.topProjects.slice(0, 2).map((project, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-gray-900">{project.type}</div>
                  <div className="text-gray-600">{project.developer}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${(project.value / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-gray-600">{project.sqft.toLocaleString()} sq ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}