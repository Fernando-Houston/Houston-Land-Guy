'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Brain, 
  Eye, 
  Database, 
  FileSearch, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface AgentMetrics {
  totalTasks: number
  successfulTasks: number
  failedTasks: number
  averageExecutionTime: number
  lastExecutionTime?: number
  errorRate: number
}

interface AgentStatus {
  name: string
  isProcessing: boolean
  queueLength: number
  metrics?: AgentMetrics
}

const agentIcons: Record<string, any> = {
  'VisualIntelligenceAgent': Eye,
  'APIIntegrationAgent': Database,
  'DataAccuracyAgent': CheckCircle,
  'MarketAnalysisAgent': TrendingUp,
  'DocumentProcessingAgent': FileSearch
}

export function AgentMonitor() {
  const [agents, setAgents] = useState<Record<string, AgentStatus>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  async function fetchAgentStatus() {
    try {
      const response = await fetch('/api/agents/analyze')
      if (!response.ok) throw new Error('Failed to fetch agent status')
      
      const data = await response.json()
      setAgents(data.status || {})
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }
  
  function getAgentHealth(metrics?: AgentMetrics): 'healthy' | 'warning' | 'error' {
    if (!metrics) return 'warning'
    if (metrics.errorRate > 0.3) return 'error'
    if (metrics.errorRate > 0.1) return 'warning'
    return 'healthy'
  }
  
  function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading agent status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Multi-Agent System Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(agents).map(([agentName, status]) => {
              const Icon = agentIcons[agentName] || Brain
              const health = getAgentHealth(status.metrics)
              const healthColor = {
                healthy: 'text-green-600 bg-green-50',
                warning: 'text-yellow-600 bg-yellow-50',
                error: 'text-red-600 bg-red-50'
              }[health]
              
              return (
                <Card key={agentName} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${healthColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm">
                          {agentName.replace('Agent', '').replace('Wrapper', '')}
                        </h3>
                      </div>
                      <Badge 
                        variant={status.isProcessing ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {status.isProcessing ? 'Active' : 'Idle'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {status.metrics ? (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-medium">
                              {((1 - status.metrics.errorRate) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={(1 - status.metrics.errorRate) * 100} 
                            className="h-1.5"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Total Tasks</p>
                            <p className="font-semibold">{status.metrics.totalTasks}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg Time</p>
                            <p className="font-semibold">
                              {formatTime(status.metrics.averageExecutionTime)}
                            </p>
                          </div>
                        </div>
                        
                        {status.queueLength > 0 && (
                          <div className="flex items-center text-xs text-yellow-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {status.queueLength} tasks queued
                          </div>
                        )}
                        
                        {status.metrics.lastExecutionTime && (
                          <div className="text-xs text-muted-foreground">
                            Last run: {formatTime(status.metrics.lastExecutionTime)} ago
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No metrics available</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* System Overview */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">System Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Active Agents</p>
                <p className="font-semibold text-lg">
                  {Object.values(agents).filter(a => a.isProcessing).length} / {Object.keys(agents).length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Processed</p>
                <p className="font-semibold text-lg">
                  {Object.values(agents).reduce((sum, a) => sum + (a.metrics?.totalTasks || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Success Rate</p>
                <p className="font-semibold text-lg">
                  {(() => {
                    const totals = Object.values(agents).reduce((acc, a) => {
                      if (a.metrics) {
                        acc.total += a.metrics.totalTasks
                        acc.success += a.metrics.successfulTasks
                      }
                      return acc
                    }, { total: 0, success: 0 })
                    
                    return totals.total > 0 
                      ? `${((totals.success / totals.total) * 100).toFixed(1)}%`
                      : 'N/A'
                  })()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Response</p>
                <p className="font-semibold text-lg">
                  {(() => {
                    const times = Object.values(agents)
                      .filter(a => a.metrics?.averageExecutionTime)
                      .map(a => a.metrics!.averageExecutionTime)
                    
                    if (times.length === 0) return 'N/A'
                    
                    const avg = times.reduce((sum, t) => sum + t, 0) / times.length
                    return formatTime(avg)
                  })()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}