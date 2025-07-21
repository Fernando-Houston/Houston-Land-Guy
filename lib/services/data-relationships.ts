import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DataRelationship {
  sourceEntity: string
  targetEntity: string
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many'
  description: string
  joinField?: string
}

interface RelationshipMapping {
  developer: {
    projects: string[]
    permits: string[]
    properties: string[]
  }
  neighborhood: {
    demographics: string[]
    marketData: string[]
    properties: string[]
    projects: string[]
    employers: string[]
  }
  employer: {
    neighborhoods: string[]
    populationGrowth: number
    housingDemand: number
  }
}

export class DataRelationshipService {
  // Define all data relationships in the system
  private relationships: DataRelationship[] = [
    // Developer relationships
    {
      sourceEntity: 'Developer',
      targetEntity: 'Project',
      relationshipType: 'one-to-many',
      description: 'A developer can have multiple projects',
      joinField: 'developerId'
    },
    {
      sourceEntity: 'Developer',
      targetEntity: 'Permit',
      relationshipType: 'one-to-many',
      description: 'A developer can have multiple permits through projects',
      joinField: 'project.developerId'
    },
    
    // Project relationships
    {
      sourceEntity: 'Project',
      targetEntity: 'Permit',
      relationshipType: 'one-to-many',
      description: 'A project can have multiple permits',
      joinField: 'projectId'
    },
    {
      sourceEntity: 'Project',
      targetEntity: 'Neighborhood',
      relationshipType: 'many-to-many',
      description: 'Projects can span multiple neighborhoods',
      joinField: 'projectNeighborhoods'
    },
    
    // Neighborhood relationships
    {
      sourceEntity: 'Neighborhood',
      targetEntity: 'Demographic',
      relationshipType: 'one-to-many',
      description: 'A neighborhood has demographic data over time',
      joinField: 'neighborhoodId'
    },
    {
      sourceEntity: 'Neighborhood',
      targetEntity: 'MarketData',
      relationshipType: 'one-to-many',
      description: 'A neighborhood has market data over time',
      joinField: 'neighborhoodId'
    },
    {
      sourceEntity: 'Neighborhood',
      targetEntity: 'Property',
      relationshipType: 'one-to-many',
      description: 'A neighborhood contains multiple properties',
      joinField: 'neighborhoodId'
    },
    
    // Employer relationships
    {
      sourceEntity: 'Employer',
      targetEntity: 'Neighborhood',
      relationshipType: 'many-to-many',
      description: 'Employers can have offices in multiple neighborhoods',
      joinField: 'employerNeighborhoods'
    },
    {
      sourceEntity: 'Employer',
      targetEntity: 'PopulationGrowth',
      relationshipType: 'one-to-many',
      description: 'Major employers drive population growth',
      joinField: 'employerId'
    },
    
    // Property relationships
    {
      sourceEntity: 'Property',
      targetEntity: 'Permit',
      relationshipType: 'one-to-many',
      description: 'A property can have multiple permits',
      joinField: 'propertyId'
    },
    {
      sourceEntity: 'Property',
      targetEntity: 'MarketData',
      relationshipType: 'many-to-one',
      description: 'Property values are influenced by market data',
      joinField: 'neighborhoodId'
    }
  ]
  
  // Get complete developer ecosystem data
  async getDeveloperEcosystem(developerId: string): Promise<any> {
    const developer = await prisma.developer.findUnique({
      where: { id: developerId },
      include: {
        projects: {
          include: {
            permits: true,
            neighborhood: true
          }
        }
      }
    })
    
    if (!developer) return null
    
    // Calculate additional metrics
    const totalPermits = developer.projects.reduce((sum, project) => 
      sum + (project.permits?.length || 0), 0
    )
    
    const totalConstructionValue = developer.projects.reduce((sum, project) => 
      sum + (project.value || 0), 0
    )
    
    const activeProjects = developer.projects.filter(p => p.status === 'active').length
    
    const neighborhoodsActive = new Set(
      developer.projects
        .filter(p => p.neighborhood)
        .map(p => p.neighborhoodId)
    ).size
    
    return {
      developer,
      metrics: {
        totalProjects: developer.projects.length,
        activeProjects,
        totalPermits,
        totalConstructionValue,
        neighborhoodsActive,
        averageProjectValue: totalConstructionValue / developer.projects.length
      },
      timeline: this.generateDeveloperTimeline(developer.projects)
    }
  }
  
  // Get complete neighborhood ecosystem data
  async getNeighborhoodEcosystem(neighborhoodId: string): Promise<any> {
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
      include: {
        demographics: {
          orderBy: { year: 'desc' },
          take: 5
        },
        marketData: {
          orderBy: { date: 'desc' },
          take: 12
        },
        projects: {
          include: {
            developer: true,
            permits: true
          }
        },
        properties: {
          take: 100
        }
      }
    })
    
    if (!neighborhood) return null
    
    // Get employers in the area
    const employers = await this.getEmployersInArea(neighborhood.boundaries)
    
    // Calculate housing demand based on employment
    const housingDemand = this.calculateHousingDemand(
      employers,
      neighborhood.demographics[0]
    )
    
    // Calculate growth indicators
    const growthIndicators = this.calculateGrowthIndicators(
      neighborhood.demographics,
      neighborhood.marketData,
      neighborhood.projects
    )
    
    return {
      neighborhood,
      employers,
      housingDemand,
      growthIndicators,
      developmentActivity: {
        activeProjects: neighborhood.projects.filter(p => p.status === 'active').length,
        totalInvestment: neighborhood.projects.reduce((sum, p) => sum + (p.value || 0), 0),
        topDevelopers: this.getTopDevelopersInArea(neighborhood.projects),
        permitActivity: this.getPermitTrends(neighborhood.projects)
      }
    }
  }
  
  // Get employer impact on housing
  async getEmployerHousingImpact(employerId: string): Promise<any> {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: {
        neighborhoods: true
      }
    })
    
    if (!employer) return null
    
    // Calculate housing demand from this employer
    const housingDemandGenerated = Math.round(employer.employeeCount * 0.4) // 40% need housing
    
    // Get nearby neighborhoods
    const nearbyNeighborhoods = await this.getNearbyNeighborhoods(
      employer.location,
      5 // 5 mile radius
    )
    
    // Calculate impact on each neighborhood
    const neighborhoodImpacts = await Promise.all(
      nearbyNeighborhoods.map(async n => {
        const marketData = await prisma.marketData.findFirst({
          where: { neighborhoodId: n.id },
          orderBy: { date: 'desc' }
        })
        
        return {
          neighborhood: n.name,
          distance: n.distance,
          currentInventory: marketData?.activeListings || 0,
          demandPressure: housingDemandGenerated / (marketData?.activeListings || 1),
          priceImpact: this.calculatePriceImpact(housingDemandGenerated, marketData)
        }
      })
    )
    
    return {
      employer,
      housingDemandGenerated,
      employeeGrowthRate: employer.growthRate || 0,
      projectedDemand5Years: housingDemandGenerated * (1 + (employer.growthRate || 0) / 100) ** 5,
      neighborhoodImpacts,
      recommendedDevelopmentAreas: neighborhoodImpacts
        .filter(n => n.demandPressure > 0.5)
        .sort((a, b) => b.demandPressure - a.demandPressure)
        .slice(0, 3)
    }
  }
  
  // Create relationship map for visualization
  async createRelationshipMap(entityType: string, entityId: string): Promise<any> {
    const relationships = new Map<string, any[]>()
    
    switch (entityType) {
      case 'developer':
        const devData = await this.getDeveloperRelationships(entityId)
        relationships.set('projects', devData.projects)
        relationships.set('permits', devData.permits)
        relationships.set('neighborhoods', devData.neighborhoods)
        break
        
      case 'neighborhood':
        const neighData = await this.getNeighborhoodRelationships(entityId)
        relationships.set('demographics', neighData.demographics)
        relationships.set('projects', neighData.projects)
        relationships.set('developers', neighData.developers)
        relationships.set('employers', neighData.employers)
        break
        
      case 'employer':
        const empData = await this.getEmployerRelationships(entityId)
        relationships.set('neighborhoods', empData.neighborhoods)
        relationships.set('housingImpact', empData.housingImpact)
        relationships.set('populationGrowth', empData.populationGrowth)
        break
    }
    
    return {
      entityType,
      entityId,
      relationships: Object.fromEntries(relationships),
      visualization: this.generateVisualizationData(relationships)
    }
  }
  
  // Helper methods
  private async getDeveloperRelationships(developerId: string) {
    const developer = await prisma.developer.findUnique({
      where: { id: developerId },
      include: {
        projects: {
          include: {
            permits: true,
            neighborhood: true
          }
        }
      }
    })
    
    if (!developer) return { projects: [], permits: [], neighborhoods: [] }
    
    const permits = developer.projects.flatMap(p => p.permits || [])
    const neighborhoods = [...new Set(
      developer.projects
        .filter(p => p.neighborhood)
        .map(p => p.neighborhood)
    )]
    
    return {
      projects: developer.projects,
      permits,
      neighborhoods
    }
  }
  
  private async getNeighborhoodRelationships(neighborhoodId: string) {
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
      include: {
        demographics: { orderBy: { year: 'desc' }, take: 5 },
        marketData: { orderBy: { date: 'desc' }, take: 12 },
        projects: {
          include: { developer: true }
        }
      }
    })
    
    if (!neighborhood) return { 
      demographics: [], 
      projects: [], 
      developers: [], 
      employers: [] 
    }
    
    const developers = [...new Set(
      neighborhood.projects
        .filter(p => p.developer)
        .map(p => p.developer)
    )]
    
    const employers = await this.getEmployersInArea(neighborhood.boundaries)
    
    return {
      demographics: neighborhood.demographics,
      projects: neighborhood.projects,
      developers,
      employers
    }
  }
  
  private async getEmployerRelationships(employerId: string) {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId }
    })
    
    if (!employer) return { 
      neighborhoods: [], 
      housingImpact: null, 
      populationGrowth: null 
    }
    
    const neighborhoods = await this.getNearbyNeighborhoods(employer.location, 5)
    const housingImpact = await this.getEmployerHousingImpact(employerId)
    const populationGrowth = this.calculatePopulationGrowth(employer)
    
    return {
      neighborhoods,
      housingImpact,
      populationGrowth
    }
  }
  
  private generateDeveloperTimeline(projects: any[]): any[] {
    return projects
      .filter(p => p.startDate)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(p => ({
        date: p.startDate,
        event: `${p.name} - ${p.status}`,
        value: p.value,
        permits: p.permits?.length || 0
      }))
  }
  
  private async getEmployersInArea(boundaries: any): Promise<any[]> {
    // In production, this would use PostGIS or similar for spatial queries
    // For now, return mock data
    return []
  }
  
  private async getNearbyNeighborhoods(location: string, radiusMiles: number): Promise<any[]> {
    // In production, this would use spatial queries
    // For now, return all neighborhoods with mock distances
    const neighborhoods = await prisma.neighborhood.findMany({
      take: 10
    })
    
    return neighborhoods.map(n => ({
      ...n,
      distance: Math.random() * radiusMiles
    }))
  }
  
  private calculateHousingDemand(employers: any[], demographic: any): number {
    const totalEmployees = employers.reduce((sum, e) => sum + (e.employeeCount || 0), 0)
    const currentPopulation = demographic?.population || 0
    const housingUnits = demographic?.housingUnits || currentPopulation / 2.5
    
    // Assume 40% of new employees need housing
    const newHousingDemand = totalEmployees * 0.4
    const currentOccupancy = currentPopulation / housingUnits
    
    return Math.round(newHousingDemand * (1 - currentOccupancy))
  }
  
  private calculateGrowthIndicators(
    demographics: any[], 
    marketData: any[], 
    projects: any[]
  ): any {
    const populationGrowth = demographics.length > 1
      ? ((demographics[0].population - demographics[1].population) / demographics[1].population) * 100
      : 0
      
    const priceGrowth = marketData.length > 0
      ? marketData[0].priceChangeYoY || 0
      : 0
      
    const developmentActivity = projects.filter(p => 
      p.status === 'active' || p.status === 'under_construction'
    ).length
    
    return {
      populationGrowth,
      priceGrowth,
      developmentActivity,
      growthScore: (populationGrowth * 0.3 + priceGrowth * 0.4 + developmentActivity * 5) / 10
    }
  }
  
  private getTopDevelopersInArea(projects: any[]): any[] {
    const developerCounts = projects.reduce((acc, project) => {
      if (project.developer) {
        const name = project.developer.name
        acc[name] = (acc[name] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(developerCounts)
      .map(([name, count]) => ({ name, projectCount: count }))
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 5)
  }
  
  private getPermitTrends(projects: any[]): any {
    const permitsByMonth = projects
      .flatMap(p => p.permits || [])
      .reduce((acc, permit) => {
        if (permit.issuedDate) {
          const month = new Date(permit.issuedDate).toISOString().substring(0, 7)
          acc[month] = (acc[month] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)
    
    return {
      byMonth: permitsByMonth,
      total: Object.values(permitsByMonth).reduce((a, b) => a + b, 0),
      trend: this.calculateTrend(Object.entries(permitsByMonth))
    }
  }
  
  private calculatePriceImpact(
    housingDemand: number, 
    marketData: any
  ): number {
    if (!marketData) return 0
    
    const supplyDemandRatio = housingDemand / (marketData.activeListings || 1)
    // Rough estimate: 10% demand/supply imbalance = 1% price impact
    return Math.min(supplyDemandRatio * 0.1, 0.15) // Cap at 15%
  }
  
  private calculatePopulationGrowth(employer: any): any {
    const directGrowth = employer.employeeCount
    const indirectGrowth = employer.employeeCount * 1.5 // Multiplier effect
    const familySize = 2.5
    
    return {
      directEmployees: directGrowth,
      indirectJobs: indirectGrowth,
      totalPopulationImpact: (directGrowth + indirectGrowth) * familySize,
      annualGrowthRate: employer.growthRate || 0
    }
  }
  
  private calculateTrend(data: [string, number][]): string {
    if (data.length < 2) return 'insufficient data'
    
    const sorted = data.sort((a, b) => a[0].localeCompare(b[0]))
    const recent = sorted.slice(-3).map(d => d[1])
    const older = sorted.slice(-6, -3).map(d => d[1])
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100
    
    if (change > 10) return 'increasing'
    if (change < -10) return 'decreasing'
    return 'stable'
  }
  
  private generateVisualizationData(relationships: Map<string, any[]>): any {
    const nodes: any[] = []
    const edges: any[] = []
    let nodeId = 0
    
    // Create center node
    const centerNode = {
      id: nodeId++,
      label: 'Center',
      type: 'center'
    }
    nodes.push(centerNode)
    
    // Create nodes and edges for each relationship type
    for (const [type, items] of relationships) {
      const typeNode = {
        id: nodeId++,
        label: type,
        type: 'category'
      }
      nodes.push(typeNode)
      edges.push({
        source: centerNode.id,
        target: typeNode.id
      })
      
      // Add individual items
      items.slice(0, 5).forEach(item => {
        const itemNode = {
          id: nodeId++,
          label: item.name || item.id,
          type: 'item'
        }
        nodes.push(itemNode)
        edges.push({
          source: typeNode.id,
          target: itemNode.id
        })
      })
    }
    
    return { nodes, edges }
  }
  
  // Get all relationships summary
  async getAllRelationshipsSummary(): Promise<any> {
    const [
      developerCount,
      projectCount,
      permitCount,
      neighborhoodCount,
      employerCount,
      propertyCount
    ] = await Promise.all([
      prisma.developer.count(),
      prisma.project.count(),
      prisma.permit.count(),
      prisma.neighborhood.count(),
      prisma.employer.count(),
      prisma.property.count()
    ])
    
    // Calculate relationship counts
    const projectsWithDevelopers = await prisma.project.count({
      where: { developerId: { not: null } }
    })
    
    const permitsWithProjects = await prisma.permit.count({
      where: { projectId: { not: null } }
    })
    
    const propertiesWithNeighborhoods = await prisma.property.count({
      where: { neighborhoodId: { not: null } }
    })
    
    return {
      entities: {
        developers: developerCount,
        projects: projectCount,
        permits: permitCount,
        neighborhoods: neighborhoodCount,
        employers: employerCount,
        properties: propertyCount
      },
      relationships: {
        'developer-project': projectsWithDevelopers,
        'project-permit': permitsWithProjects,
        'property-neighborhood': propertiesWithNeighborhoods,
        completeness: {
          'developer-project': (projectsWithDevelopers / projectCount * 100).toFixed(1) + '%',
          'project-permit': (permitsWithProjects / permitCount * 100).toFixed(1) + '%',
          'property-neighborhood': (propertiesWithNeighborhoods / propertyCount * 100).toFixed(1) + '%'
        }
      },
      healthScore: this.calculateSystemHealthScore({
        projectsWithDevelopers,
        projectCount,
        permitsWithProjects,
        permitCount,
        propertiesWithNeighborhoods,
        propertyCount
      })
    }
  }
  
  private calculateSystemHealthScore(metrics: any): number {
    const scores = [
      metrics.projectsWithDevelopers / metrics.projectCount,
      metrics.permitsWithProjects / metrics.permitCount,
      metrics.propertiesWithNeighborhoods / metrics.propertyCount
    ]
    
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }
}

export const dataRelationshipService = new DataRelationshipService()