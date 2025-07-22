import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Sample buyer profiles for instant offers
const buyerProfiles = [
  {
    id: 'buyer-1',
    buyerType: 'Cash Investor',
    name: 'Houston Property Investments LLC',
    offerPercentage: 0.92, // 92% of estimated value
    closingDays: 7,
    contingencies: [],
    proofOfFunds: true,
    buyerRating: 4.8,
    specialties: ['quick-close', 'as-is'],
    minBudget: 150000,
    maxBudget: 800000
  },
  {
    id: 'buyer-2',
    buyerType: 'International Buyer',
    name: 'Global Real Estate Holdings',
    offerPercentage: 0.90,
    closingDays: 14,
    contingencies: [],
    proofOfFunds: true,
    buyerRating: 4.5,
    specialties: ['luxury', 'investment'],
    minBudget: 300000,
    maxBudget: 2000000
  },
  {
    id: 'buyer-3',
    buyerType: 'Traditional Buyer',
    name: 'First Home Buyers Group',
    offerPercentage: 0.95,
    closingDays: 30,
    contingencies: ['Financing', 'Inspection'],
    proofOfFunds: false,
    buyerRating: 4.2,
    specialties: ['family-homes', 'good-schools'],
    minBudget: 200000,
    maxBudget: 600000
  },
  {
    id: 'buyer-4',
    buyerType: 'iBuyer',
    name: 'QuickBuy Houston',
    offerPercentage: 0.88,
    closingDays: 10,
    contingencies: ['Inspection'],
    proofOfFunds: true,
    buyerRating: 4.0,
    specialties: ['standard-homes', 'good-condition'],
    minBudget: 150000,
    maxBudget: 500000
  },
  {
    id: 'buyer-5',
    buyerType: 'Developer',
    name: 'Urban Redevelopment Partners',
    offerPercentage: 0.85,
    closingDays: 21,
    contingencies: ['Zoning Approval'],
    proofOfFunds: true,
    buyerRating: 4.3,
    specialties: ['teardowns', 'large-lots'],
    minBudget: 200000,
    maxBudget: 1500000
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, bedrooms, bathrooms, squareFeet, propertyType, condition } = body;

    // Basic property value estimation (simplified)
    // In production, this would use ML models and comparables
    const baseValuePerSqft = {
      'single-family': 150,
      'condo': 125,
      'townhouse': 135,
      'multi-family': 110
    };

    const conditionMultiplier = {
      'excellent': 1.15,
      'good': 1.0,
      'fair': 0.85,
      'needs-work': 0.70
    };

    // Calculate estimated value
    const baseSqftValue = baseValuePerSqft[propertyType as keyof typeof baseValuePerSqft] || 150;
    const conditionMult = conditionMultiplier[condition as keyof typeof conditionMultiplier] || 1.0;
    
    const estimatedValue = Math.round(
      parseInt(squareFeet) * baseSqftValue * conditionMult * 
      (1 + (parseInt(bedrooms) * 0.02) + (parseFloat(bathrooms) * 0.03))
    );

    // Get comparable sales from database (if available)
    let comparables = [];
    try {
      const recentSales = await prisma.property.findMany({
        where: {
          bedrooms: { gte: parseInt(bedrooms) - 1, lte: parseInt(bedrooms) + 1 },
          bathrooms: { gte: parseFloat(bathrooms) - 0.5, lte: parseFloat(bathrooms) + 0.5 },
          squareFeet: { gte: parseInt(squareFeet) - 500, lte: parseInt(squareFeet) + 500 },
          soldPrice: { not: null }
        },
        take: 5,
        orderBy: { soldDate: 'desc' }
      });

      comparables = recentSales.map(sale => ({
        address: sale.address,
        soldPrice: sale.soldPrice,
        soldDate: sale.soldDate,
        squareFeet: sale.squareFeet,
        pricePerSqft: sale.soldPrice ? Math.round(sale.soldPrice / (sale.squareFeet || 1)) : 0
      }));
    } catch (error) {
      console.log('No comparables found');
    }

    // Generate instant offers from buyer network
    const eligibleBuyers = buyerProfiles.filter(buyer => 
      estimatedValue >= buyer.minBudget && 
      estimatedValue <= buyer.maxBudget
    );

    const cashOffers = eligibleBuyers.map(buyer => ({
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerType: buyer.buyerType,
      offerAmount: Math.round(estimatedValue * buyer.offerPercentage),
      closingDays: buyer.closingDays,
      contingencies: buyer.contingencies,
      proofOfFunds: buyer.proofOfFunds,
      buyerRating: buyer.buyerRating,
      offerExpiration: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    }));

    // Sort offers by amount (highest first)
    cashOffers.sort((a, b) => b.offerAmount - a.offerAmount);

    // Calculate market comparison
    const avgOfferAmount = cashOffers.reduce((sum, offer) => sum + offer.offerAmount, 0) / cashOffers.length;
    const marketComparison = {
      vsEstimatedValue: Math.round((avgOfferAmount / estimatedValue - 1) * 100),
      vsRecentSales: comparables.length > 0 
        ? Math.round((avgOfferAmount / (comparables[0].soldPrice || estimatedValue) - 1) * 100)
        : 0
    };

    const response = {
      instantEstimate: {
        low: Math.round(estimatedValue * 0.9),
        mid: estimatedValue,
        high: Math.round(estimatedValue * 1.1)
      },
      cashOffers,
      marketComparison,
      comparables,
      totalBuyersInNetwork: 523,
      responseTime: '< 48 hours',
      disclaimer: 'Estimates are based on limited data. Actual offers may vary.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating instant offers:', error);
    return NextResponse.json(
      { error: 'Failed to generate instant offers' },
      { status: 500 }
    );
  }
}