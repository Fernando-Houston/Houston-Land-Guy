import { NextResponse } from 'next/server';
import { CoreAgentsClient } from '@/lib/api/core-agents';

export async function GET() {
  try {
    const coreAgents = new CoreAgentsClient();
    
    // Fetch market timing indicators
    const timingData = await coreAgents.getMarketTiming({
      city: 'Houston',
      state: 'TX'
    });

    // Calculate timing scores based on multiple factors
    const indicators = {
      priceGrowth: timingData.priceGrowth || 5.2,
      inventoryMonths: timingData.inventoryMonths || 2.8,
      interestRates: timingData.interestRates || 7.2,
      constructionCosts: timingData.constructionCosts || 'stable',
      permitActivity: timingData.permitActivity || 'high',
      populationGrowth: timingData.populationGrowth || 2.1
    };

    // Calculate scores (0-100)
    const buyScore = calculateBuyScore(indicators);
    const sellScore = calculateSellScore(indicators);
    const holdScore = calculateHoldScore(indicators);
    const overallScore = Math.round((buyScore + sellScore + holdScore) / 3);

    return NextResponse.json({
      overallScore,
      buyScore,
      sellScore,
      holdScore,
      indicators,
      recommendation: getRecommendation(buyScore, sellScore, holdScore),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market timing error:', error);
    
    // Return calculated mock data
    return NextResponse.json({
      overallScore: 75,
      buyScore: 82,
      sellScore: 68,
      holdScore: 75,
      indicators: {
        priceGrowth: 5.2,
        inventoryMonths: 2.8,
        interestRates: 7.2,
        constructionCosts: 'stable',
        permitActivity: 'high',
        populationGrowth: 2.1
      },
      recommendation: 'Strong buy signal for development land in suburban markets',
      lastUpdated: new Date().toISOString()
    });
  }
}

function calculateBuyScore(indicators: any): number {
  let score = 50; // Base score
  
  // Positive factors for buying
  if (indicators.priceGrowth > 3) score += 15;
  if (indicators.inventoryMonths < 3) score += 10;
  if (indicators.populationGrowth > 1.5) score += 10;
  if (indicators.permitActivity === 'high') score += 10;
  
  // Negative factors
  if (indicators.interestRates > 7) score -= 5;
  if (indicators.constructionCosts === 'rising') score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateSellScore(indicators: any): number {
  let score = 50;
  
  // Positive factors for selling
  if (indicators.priceGrowth > 7) score += 20;
  if (indicators.inventoryMonths < 2) score += 15;
  
  // Negative factors
  if (indicators.interestRates > 7) score -= 10;
  if (indicators.populationGrowth < 1) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}

function calculateHoldScore(indicators: any): number {
  let score = 50;
  
  // Stable market indicators
  if (indicators.priceGrowth > 2 && indicators.priceGrowth < 6) score += 15;
  if (indicators.constructionCosts === 'stable') score += 10;
  if (indicators.populationGrowth > 1) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function getRecommendation(buyScore: number, sellScore: number, holdScore: number): string {
  const maxScore = Math.max(buyScore, sellScore, holdScore);
  
  if (maxScore === buyScore) {
    return 'Strong buy signal for development land in suburban markets';
  } else if (maxScore === sellScore) {
    return 'Consider selling undeveloped land or accelerating projects';
  } else {
    return 'Hold existing properties and wait for better opportunities';
  }
}