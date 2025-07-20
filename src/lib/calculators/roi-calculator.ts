import { PropertyDetails, DevelopmentCosts, ROIProjection } from '@/types/calculator';
import { houstonDataService } from '@/lib/services/houston-data-service';

export class ROICalculator {
  // Updated with real Houston construction costs (2024 data)
  private static readonly CONSTRUCTION_COST_PER_SQFT = {
    residential: { low: 125, mid: 155, high: 275 }, // Updated from real data
    commercial: { low: 150, mid: 190, high: 295 }, // Updated from real data  
    'mixed-use': { low: 175, mid: 250, high: 400 },
    industrial: { low: 48, mid: 68, high: 120 }, // Added from real data
    multifamily: { low: 115, mid: 140, high: 210 } // Added from real data
  };
  
  // Real Houston market data (from Katy Heights ROI analysis)
  private static readonly HOUSTON_MARKET_METRICS = {
    medianPropertyValue: 285105,
    medianAppraisedValue: 259515,
    pricePerSqFt: 165.56,
    propertyTaxRate: 2.12, // 2.12%
    constructionCostPerSqFt: 250,
    averageDaysOnMarket: 52,
    buildingPermitFee: 1647,
    impactFee: 5750,
    annualRent3to4BR: 28800
  };
  
  // Real Houston cap rates by property type
  private static readonly HOUSTON_CAP_RATES = {
    'industrial': 6.8,
    'multifamily': 5.2,
    'mixed-use': 7.5,
    'office': 8.5,
    'residential': 6.0 // estimated
  };

  // Updated with real Houston costs
  private static readonly PERMIT_COST_PERCENTAGE = 0.025;
  private static readonly UTILITY_COST_PERCENTAGE = 0.03;
  private static readonly CONTINGENCY_PERCENTAGE = 0.10; // Reduced based on market conditions
  private static readonly FINANCING_COST_PERCENTAGE = 0.08; // Aligned with real lending rates
  
  // Real Houston lending rates (from commercial market data)
  private static readonly HOUSTON_LENDING_RATES = {
    multifamily: { min: 5.25, max: 5.80, typical: 5.50 },
    commercial: { min: 6.00, max: 6.50, typical: 6.25 },
    bridge: { min: 8.25, max: 9.25, typical: 8.75 },
    construction: { min: 7.50, max: 8.50, typical: 8.00 }
  };

  static calculateDevelopmentCosts(
    property: PropertyDetails,
    projectType: 'residential' | 'commercial' | 'mixed-use' | 'industrial' | 'multifamily',
    qualityLevel: 'low' | 'mid' | 'high' = 'mid',
    buildingSqFt: number,
    useHoustonData: boolean = true
  ): DevelopmentCosts {
    const landAcquisition = property.currentValue;
    let constructionCostPerSqFt = this.CONSTRUCTION_COST_PER_SQFT[projectType]?.[qualityLevel] || this.CONSTRUCTION_COST_PER_SQFT['mixed-use'][qualityLevel];
    
    // Use real Houston construction cost if available and requested
    if (useHoustonData && qualityLevel === 'mid') {
      constructionCostPerSqFt = this.HOUSTON_MARKET_METRICS.constructionCostPerSqFt;
    }
    
    const construction = buildingSqFt * constructionCostPerSqFt;
    
    const baseConstruction = landAcquisition + construction;
    
    // Use real Houston permit fees if available
    let permits = baseConstruction * this.PERMIT_COST_PERCENTAGE;
    if (useHoustonData) {
      permits = Math.max(permits, this.HOUSTON_MARKET_METRICS.buildingPermitFee + this.HOUSTON_MARKET_METRICS.impactFee);
    }
    
    const utilities = baseConstruction * this.UTILITY_COST_PERCENTAGE;
    const contingency = baseConstruction * this.CONTINGENCY_PERCENTAGE;
    
    // Use Houston-specific financing rates
    let financingRate = this.FINANCING_COST_PERCENTAGE;
    if (useHoustonData && projectType in this.HOUSTON_LENDING_RATES) {
      const rates = this.HOUSTON_LENDING_RATES[projectType as keyof typeof this.HOUSTON_LENDING_RATES];
      financingRate = rates.typical / 100; // Convert percentage to decimal
    }
    
    const financing = (baseConstruction + permits + utilities) * financingRate;

    const total = landAcquisition + construction + permits + utilities + contingency + financing;

    return {
      landAcquisition,
      construction,
      permits,
      utilities,
      contingency,
      financing,
      total
    };
  }

  static calculateROI(
    developmentCosts: DevelopmentCosts,
    projectedRevenue: number,
    projectDurationMonths: number = 24,
    projectType?: 'residential' | 'commercial' | 'mixed-use' | 'industrial' | 'multifamily'
  ): ROIProjection {
    const totalInvestment = developmentCosts.total;
    const netProfit = projectedRevenue - totalInvestment;
    const roi = (netProfit / totalInvestment) * 100;
    const monthlyReturn = netProfit / projectDurationMonths;
    const paybackPeriod = totalInvestment / (monthlyReturn > 0 ? monthlyReturn : 1);

    let irr = this.calculateIRR(
      totalInvestment,
      projectedRevenue,
      projectDurationMonths
    );
    
    // Add Houston market context and cap rate analysis
    let marketCapRate = 6.0; // default
    if (projectType && projectType in this.HOUSTON_CAP_RATES) {
      marketCapRate = this.HOUSTON_CAP_RATES[projectType as keyof typeof this.HOUSTON_CAP_RATES];
    }
    
    // Calculate NOI-based valuation for comparison
    const estimatedNOI = projectedRevenue * 0.75; // Assuming 75% NOI margin
    const capRateBasedValue = estimatedNOI / (marketCapRate / 100);

    const timeline = this.generateProjectTimeline(projectDurationMonths);

    return {
      totalInvestment,
      projectedRevenue,
      netProfit,
      roi,
      paybackPeriod,
      irr,
      timeline,
      // Add Houston-specific metrics
      houstonMetrics: {
        marketCapRate,
        capRateBasedValue,
        daysOnMarket: this.HOUSTON_MARKET_METRICS.averageDaysOnMarket,
        propertyTaxRate: this.HOUSTON_MARKET_METRICS.propertyTaxRate,
        marketComparison: {
          medianPropertyValue: this.HOUSTON_MARKET_METRICS.medianPropertyValue,
          medianPricePerSqFt: this.HOUSTON_MARKET_METRICS.pricePerSqFt
        }
      }
    };
  }

  private static calculateIRR(
    initialInvestment: number,
    finalValue: number,
    months: number
  ): number {
    const years = months / 12;
    const irr = Math.pow(finalValue / initialInvestment, 1 / years) - 1;
    return irr * 100;
  }

  private static generateProjectTimeline(totalMonths: number): ROIProjection['timeline'] {
    const phases = [
      { phase: 'Planning & Permits', duration: Math.floor(totalMonths * 0.15) },
      { phase: 'Site Preparation', duration: Math.floor(totalMonths * 0.1) },
      { phase: 'Construction', duration: Math.floor(totalMonths * 0.5) },
      { phase: 'Finishing & Inspection', duration: Math.floor(totalMonths * 0.15) },
      { phase: 'Marketing & Sale', duration: Math.floor(totalMonths * 0.1) }
    ];

    let currentMonth = 0;
    return phases.map(phase => {
      const startMonth = currentMonth;
      const endMonth = startMonth + phase.duration;
      currentMonth = endMonth;
      return {
        ...phase,
        startMonth,
        endMonth
      };
    });
  }

  static estimatePropertyValue(
    sqft: number,
    pricePerSqFt: number,
    appreciationRate: number,
    months: number,
    useHoustonData: boolean = true
  ): number {
    // Use Houston median price per sq ft if no price provided and Houston data requested
    if (!pricePerSqFt && useHoustonData) {
      pricePerSqFt = this.HOUSTON_MARKET_METRICS.pricePerSqFt;
    }
    
    const baseValue = sqft * pricePerSqFt;
    const years = months / 12;
    
    // Apply Houston market appreciation if no rate provided
    if (!appreciationRate && useHoustonData) {
      appreciationRate = 0.064; // 6.4% average YoY growth from our data
    }
    
    const futureValue = baseValue * Math.pow(1 + appreciationRate, years);
    return Math.round(futureValue);
  }
  
  // New method to get Houston-specific insights
  static async getHoustonMarketInsights(area?: string): Promise<{
    capRates: any[]
    investmentFlows: any[]
    marketForecast: any
    roiIndicators: any[]
  }> {
    try {
      const [capRates, investmentFlows, marketForecast, roiIndicators] = await Promise.all([
        houstonDataService.getCapRates(),
        houstonDataService.getInvestmentFlows(2024),
        houstonDataService.getMarketForecast(),
        houstonDataService.getROIIndicators()
      ]);
      
      return {
        capRates,
        investmentFlows,
        marketForecast, 
        roiIndicators
      };
    } catch (error) {
      console.error('Error fetching Houston market insights:', error);
      return {
        capRates: [],
        investmentFlows: [],
        marketForecast: { industrialOutlook: [], investmentTrends: [], riskFactors: [], opportunities: [] },
        roiIndicators: []
      };
    }
  }
}