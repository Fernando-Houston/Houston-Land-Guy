'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calendar, Clock, CheckCircle, AlertCircle, FileText, 
  Building2, DollarSign, Hammer, Search, MapPin, Users,
  TrendingUp, Download, ChevronRight, Info
} from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

interface TimelinePhase {
  phase: string
  duration: string
  icon: any
  color: string
  tasks: string[]
  considerations: string[]
  parallelWith?: string[]
}

export default function HoustonDevelopmentTimeline() {
  const timelinePhases: TimelinePhase[] = [
    {
      phase: "Market Research & Site Selection",
      duration: "2-4 weeks",
      icon: Search,
      color: "blue",
      tasks: [
        "Analyze target markets and demographics",
        "Review absorption rates and competition",
        "Identify potential development sites",
        "Preliminary financial feasibility analysis"
      ],
      considerations: [
        "Focus on growth corridors: Katy, Woodlands, Sugar Land",
        "Check future infrastructure plans",
        "Verify school district quality for residential"
      ]
    },
    {
      phase: "Due Diligence",
      duration: "30-60 days",
      icon: FileText,
      color: "purple",
      tasks: [
        "Title search and deed restriction review",
        "Environmental Phase I assessment",
        "Floodplain and drainage analysis",
        "Utility availability verification",
        "Geotechnical investigation",
        "Traffic impact preliminary assessment"
      ],
      considerations: [
        "Deed restrictions are critical in Houston",
        "Post-Harvey flood regulations are strict",
        "Utility capacity can be a deal-breaker"
      ]
    },
    {
      phase: "Land Acquisition",
      duration: "30-45 days",
      icon: MapPin,
      color: "green",
      tasks: [
        "Negotiate purchase agreement",
        "Secure earnest money",
        "Finalize due diligence items",
        "Close on property purchase"
      ],
      considerations: [
        "Include feasibility period contingencies",
        "Consider seller financing options",
        "Verify clear title and no liens"
      ],
      parallelWith: ["Design & Planning"]
    },
    {
      phase: "Design & Planning",
      duration: "60-120 days",
      icon: Building2,
      color: "indigo",
      tasks: [
        "Hire architect and engineers",
        "Develop conceptual plans",
        "Create detailed construction drawings",
        "Prepare permit application documents",
        "Neighborhood meetings (if required)"
      ],
      considerations: [
        "Houston has no zoning but deed restrictions apply",
        "Hurricane-resistant design required",
        "Consider LEED certification for premium projects"
      ],
      parallelWith: ["Financing"]
    },
    {
      phase: "Financing",
      duration: "45-90 days",
      icon: DollarSign,
      color: "emerald",
      tasks: [
        "Prepare loan package and pro forma",
        "Shop multiple lenders",
        "Negotiate terms and rates",
        "Complete lender due diligence",
        "Close construction loan"
      ],
      considerations: [
        "Houston banks familiar with local market",
        "Consider SBA 504 for owner-occupied",
        "Typical 70-80% LTC in current market"
      ]
    },
    {
      phase: "Permitting & Approvals",
      duration: "30-60 days",
      icon: FileText,
      color: "orange",
      tasks: [
        "Submit building permit application",
        "Plan review and corrections",
        "Obtain building permit",
        "Secure additional permits (tree, driveway, etc.)",
        "Utility connection approvals"
      ],
      considerations: [
        "Houston permits faster than most cities",
        "Use expedited review for time-sensitive projects",
        "Floodplain development requires extra time"
      ]
    },
    {
      phase: "Pre-Construction",
      duration: "2-4 weeks",
      icon: Users,
      color: "teal",
      tasks: [
        "Finalize contractor selection",
        "Execute construction contracts",
        "Submit notices to proceed",
        "Order long-lead materials",
        "Establish project controls"
      ],
      considerations: [
        "Verify contractor has Houston experience",
        "Lock in material prices if possible",
        "Set up construction loan draws"
      ]
    },
    {
      phase: "Construction",
      duration: "6-24 months",
      icon: Hammer,
      color: "red",
      tasks: [
        "Site work and utilities",
        "Foundation (critical in Houston clay soil)",
        "Structural framing",
        "MEP rough-in",
        "Exterior finishes",
        "Interior finishes",
        "Final inspections"
      ],
      considerations: [
        "Single-family: 6-8 months",
        "Multifamily: 12-18 months",
        "Commercial: 10-16 months",
        "Weather delays common in summer"
      ],
      parallelWith: ["Marketing & Leasing"]
    },
    {
      phase: "Marketing & Leasing",
      duration: "3-12 months",
      icon: TrendingUp,
      color: "pink",
      tasks: [
        "Develop marketing materials",
        "Launch digital marketing campaign",
        "Host broker events",
        "Show units/spaces to prospects",
        "Negotiate and execute leases"
      ],
      considerations: [
        "Start 3-6 months before completion",
        "Houston market responds to quality finishes",
        "Consider incentives in competitive submarkets"
      ]
    },
    {
      phase: "Project Completion",
      duration: "2-4 weeks",
      icon: CheckCircle,
      color: "green",
      tasks: [
        "Final inspections and CO",
        "Punch list completion",
        "As-built drawings",
        "Warranty documentation",
        "Property management transition"
      ],
      considerations: [
        "Certificate of Occupancy required before move-in",
        "1-year warranty standard in Texas",
        "Establish maintenance protocols"
      ]
    }
  ]

  const totalDuration = {
    bestCase: "12 months",
    typical: "18-24 months",
    complex: "24-36 months"
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200", icon: "bg-blue-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200", icon: "bg-purple-600" },
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200", icon: "bg-green-600" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200", icon: "bg-indigo-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200", icon: "bg-emerald-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200", icon: "bg-orange-600" },
      teal: { bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200", icon: "bg-teal-600" },
      red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200", icon: "bg-red-600" },
      pink: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200", icon: "bg-pink-600" }
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Houston Development <span className="gradient-text">Timeline</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Navigate your Houston development project from concept to completion. This comprehensive 
              timeline shows each phase, typical durations, and critical considerations specific to 
              the Houston market.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Download Timeline PDF
              </button>
              <Link 
                href="/development-cost-calculator"
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors"
              >
                Calculate Project Costs
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Overview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Project Duration Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Best Case</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{totalDuration.bestCase}</div>
                <p className="text-sm text-gray-600">Simple projects with no complications</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Typical</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalDuration.typical}</div>
                <p className="text-sm text-gray-600">Most Houston development projects</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
                <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Complex</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">{totalDuration.complex}</div>
                <p className="text-sm text-gray-600">Large or complicated developments</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timeline Factors</h4>
                  <p className="text-sm text-gray-700">
                    Houston's development timeline advantages include no zoning delays, faster permitting 
                    (4-8 weeks vs 3-6 months), and year-round construction weather. However, factors like 
                    deed restriction research, flood mitigation requirements, and summer weather can add time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Timeline */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Development Process Timeline</h2>
            
            <div className="relative">
              {/* Vertical line for desktop */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300"></div>
              
              <div className="space-y-12">
                {timelinePhases.map((phase, index) => {
                  const Icon = phase.icon
                  const colors = getColorClasses(phase.color)
                  const isLeft = index % 2 === 0
                  
                  return (
                    <motion.div
                      key={phase.phase}
                      className={`relative lg:flex lg:items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Timeline dot */}
                      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                        <div className={`w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className={`lg:w-1/2 ${isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                        <div className={`bg-white rounded-lg shadow-md border ${colors.border} p-6`}>
                          <div className={`flex items-center mb-4 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                            <div className={`lg:hidden w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center mr-3`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className={isLeft ? 'lg:text-right' : ''}>
                              <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                              <div className={`flex items-center mt-1 ${isLeft ? 'lg:justify-end' : ''}`}>
                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                <span className={`text-sm font-medium ${colors.text}`}>{phase.duration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className={`font-semibold text-gray-900 mb-2 ${isLeft ? 'lg:text-right' : ''}`}>
                                Key Tasks:
                              </h4>
                              <ul className={`space-y-1 ${isLeft ? 'lg:text-right' : ''}`}>
                                {phase.tasks.map((task, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <CheckCircle className={`h-4 w-4 ${colors.text} mr-2 flex-shrink-0 mt-0.5 ${isLeft ? 'lg:order-last lg:ml-2 lg:mr-0' : ''}`} />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {phase.considerations.length > 0 && (
                              <div className={`pt-3 border-t ${colors.border}`}>
                                <h4 className={`font-semibold text-gray-900 mb-2 ${isLeft ? 'lg:text-right' : ''}`}>
                                  Houston Considerations:
                                </h4>
                                <ul className={`space-y-1 ${isLeft ? 'lg:text-right' : ''}`}>
                                  {phase.considerations.map((consideration, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                      <AlertCircle className={`h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5 ${isLeft ? 'lg:order-last lg:ml-2 lg:mr-0' : ''}`} />
                                      <span>{consideration}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {phase.parallelWith && (
                              <div className={`text-sm ${colors.text} font-medium ${isLeft ? 'lg:text-right' : ''}`}>
                                Can run parallel with: {phase.parallelWith.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Success Factors */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Keys to Faster Houston Development
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <Users className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Work with Local Experts</h3>
                <p className="text-sm text-gray-600">
                  Partner with Houston-based architects, engineers, and contractors who understand 
                  local requirements, deed restrictions, and permitting processes.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <FileText className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Front-Load Due Diligence</h3>
                <p className="text-sm text-gray-600">
                  Thorough deed restriction research and early utility verification prevent costly 
                  delays later in the development process.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <Clock className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Run Parallel Processes</h3>
                <p className="text-sm text-gray-600">
                  Start design while finalizing land acquisition, begin marketing during construction, 
                  and overlap financing with planning phases.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
                <Building2 className="h-8 w-8 text-orange-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Leverage No Zoning</h3>
                <p className="text-sm text-gray-600">
                  Houston's lack of zoning eliminates months of rezoning processes, allowing 
                  market-driven development decisions.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6">
                <DollarSign className="h-8 w-8 text-teal-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Secure Financing Early</h3>
                <p className="text-sm text-gray-600">
                  Begin lender discussions during due diligence. Houston banks understand the 
                  local market and can move quickly on quality projects.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
                <MapPin className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Choose Strategic Locations</h3>
                <p className="text-sm text-gray-600">
                  Development in established areas like Katy, Woodlands, or Sugar Land often 
                  moves faster due to existing infrastructure and clear market demand.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Your Free Development Timeline Checklist
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Download our comprehensive checklist with all phases, tasks, and Houston-specific 
              considerations to keep your development project on track.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
              <Download className="h-6 w-6 mr-3" />
              Download Timeline Checklist
            </button>
          </motion.div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Related Development Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/blog/complete-guide-houston-development-regulations" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <FileText className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Development Regulations Guide
                  </h3>
                  <p className="text-sm text-gray-600">
                    Navigate Houston's unique regulatory environment and permit requirements
                  </p>
                </div>
              </Link>
              
              <Link href="/development-cost-calculator" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Cost Calculator
                  </h3>
                  <p className="text-sm text-gray-600">
                    Estimate total development costs for your Houston project
                  </p>
                </div>
              </Link>
              
              <Link href="/roi-calculator" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    ROI Calculator
                  </h3>
                  <p className="text-sm text-gray-600">
                    Calculate potential returns on Houston development opportunities
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Start Your Houston Development Project?
              </h3>
              <p className="text-gray-600">
                Get expert guidance on timeline optimization and project planning
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadCaptureForm source="DEVELOPMENT_TIMELINE" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}