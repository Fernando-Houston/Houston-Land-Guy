import { PropertyDetails, DevelopmentCosts, ROIProjection } from '@/types/calculator';

export class ROICalculator {
  private static readonly CONSTRUCTION_COST_PER_SQFT = {
    residential: { low: 120, mid: 180, high: 250 },
    commercial: { low: 150, mid: 220, high: 350 },
    'mixed-use': { low: 170, mid: 250, high: 400 }
  };

  private static readonly PERMIT_COST_PERCENTAGE = 0.025;
  private static readonly UTILITY_COST_PERCENTAGE = 0.03;
  private static readonly CONTINGENCY_PERCENTAGE = 0.15;
  private static readonly FINANCING_COST_PERCENTAGE = 0.08;

  static calculateDevelopmentCosts(
    property: PropertyDetails,
    projectType: 'residential' | 'commercial' | 'mixed-use',
    qualityLevel: 'low' | 'mid' | 'high' = 'mid',
    buildingSqFt: number
  ): DevelopmentCosts {
    const landAcquisition = property.currentValue;
    const constructionCostPerSqFt = this.CONSTRUCTION_COST_PER_SQFT[projectType][qualityLevel];
    const construction = buildingSqFt * constructionCostPerSqFt;
    
    const baseConstruction = landAcquisition + construction;
    const permits = baseConstruction * this.PERMIT_COST_PERCENTAGE;
    const utilities = baseConstruction * this.UTILITY_COST_PERCENTAGE;
    const contingency = baseConstruction * this.CONTINGENCY_PERCENTAGE;
    const financing = (baseConstruction + permits + utilities) * this.FINANCING_COST_PERCENTAGE;

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
    projectDurationMonths: number = 24
  ): ROIProjection {
    const totalInvestment = developmentCosts.total;
    const netProfit = projectedRevenue - totalInvestment;
    const roi = (netProfit / totalInvestment) * 100;
    const monthlyReturn = netProfit / projectDurationMonths;
    const paybackPeriod = totalInvestment / (monthlyReturn > 0 ? monthlyReturn : 1);

    const irr = this.calculateIRR(
      totalInvestment,
      projectedRevenue,
      projectDurationMonths
    );

    const timeline = this.generateProjectTimeline(projectDurationMonths);

    return {
      totalInvestment,
      projectedRevenue,
      netProfit,
      roi,
      paybackPeriod,
      irr,
      timeline
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
    months: number
  ): number {
    const baseValue = sqft * pricePerSqFt;
    const years = months / 12;
    const futureValue = baseValue * Math.pow(1 + appreciationRate, years);
    return Math.round(futureValue);
  }
}