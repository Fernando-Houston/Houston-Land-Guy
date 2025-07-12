'use client'

import { motion } from 'framer-motion'
import { Users, GraduationCap, Home, DollarSign } from 'lucide-react'
import { Demographics } from '@/lib/core-agents/types'

interface DemographicsCardProps {
  demographics: Demographics
  className?: string
}

export function DemographicsCard({ demographics, className = '' }: DemographicsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Demographics Overview</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div>
          <div className="flex items-center mb-3">
            <Users className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Age Distribution</h4>
          </div>
          <div className="space-y-2">
            {Object.entries(demographics.ageDistribution).map(([age, percentage]) => (
              <div key={age} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{age}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-10 text-right">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Distribution */}
        <div>
          <div className="flex items-center mb-3">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Household Income</h4>
          </div>
          <div className="space-y-2">
            {Object.entries(demographics.householdIncome).map(([income, percentage]) => (
              <div key={income} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{income}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-10 text-right">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Bachelor's Degree+</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{demographics.education.bachelors}%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Home className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm text-gray-600">Owner Occupied</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{demographics.ownerOccupied}%</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average Household Size</span>
          <span className="font-bold text-gray-900">{demographics.householdSize} people</span>
        </div>
      </div>
    </motion.div>
  )
}