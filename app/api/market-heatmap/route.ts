import { NextResponse } from 'next/server';

interface HeatMapData {
  zipCode: string;
  neighborhood: string;
  avgPrice: number;
  priceChange: number;
  activity: 'low' | 'medium' | 'high' | 'hot';
  inventory: number;
  daysOnMarket: number;
  coordinates: { x: number; y: number };
  salesVolume: number;
  newListings: number;
}

export async function GET() {
  try {
    // Mock Houston market heat map data
    // In production, this would pull from MarketMetrics and Property models
    const heatMapData: HeatMapData[] = [
      {
        zipCode: '77019',
        neighborhood: 'River Oaks',
        avgPrice: 2850000,
        priceChange: 8.2,
        activity: 'hot',
        inventory: 8.5,
        daysOnMarket: 45,
        coordinates: { x: 35, y: 45 },
        salesVolume: 45,
        newListings: 12
      },
      {
        zipCode: '77024',
        neighborhood: 'Memorial',
        avgPrice: 1250000,
        priceChange: 12.1,
        activity: 'hot',
        inventory: 12.3,
        daysOnMarket: 28,
        coordinates: { x: 25, y: 35 },
        salesVolume: 67,
        newListings: 18
      },
      {
        zipCode: '77008',
        neighborhood: 'The Heights',
        avgPrice: 485000,
        priceChange: 15.3,
        activity: 'hot',
        inventory: 18.2,
        daysOnMarket: 22,
        coordinates: { x: 45, y: 25 },
        salesVolume: 89,
        newListings: 25
      },
      {
        zipCode: '77005',
        neighborhood: 'Rice Village',
        avgPrice: 725000,
        priceChange: 6.8,
        activity: 'high',
        inventory: 15.1,
        daysOnMarket: 35,
        coordinates: { x: 40, y: 55 },
        salesVolume: 34,
        newListings: 14
      },
      {
        zipCode: '77027',
        neighborhood: 'Midtown',
        avgPrice: 420000,
        priceChange: 9.1,
        activity: 'high',
        inventory: 22.4,
        daysOnMarket: 31,
        coordinates: { x: 50, y: 50 },
        salesVolume: 56,
        newListings: 19
      },
      {
        zipCode: '77098',
        neighborhood: 'Montrose',
        avgPrice: 385000,
        priceChange: 11.2,
        activity: 'high',
        inventory: 19.8,
        daysOnMarket: 26,
        coordinates: { x: 42, y: 48 },
        salesVolume: 72,
        newListings: 22
      },
      {
        zipCode: '77030',
        neighborhood: 'Medical Center',
        avgPrice: 315000,
        priceChange: 5.4,
        activity: 'medium',
        inventory: 28.5,
        daysOnMarket: 42,
        coordinates: { x: 48, y: 60 },
        salesVolume: 28,
        newListings: 11
      },
      {
        zipCode: '77056',
        neighborhood: 'Galleria',
        avgPrice: 465000,
        priceChange: 7.3,
        activity: 'medium',
        inventory: 24.1,
        daysOnMarket: 38,
        coordinates: { x: 30, y: 40 },
        salesVolume: 41,
        newListings: 15
      },
      {
        zipCode: '77025',
        neighborhood: 'Bellaire',
        avgPrice: 395000,
        priceChange: 4.2,
        activity: 'medium',
        inventory: 31.2,
        daysOnMarket: 45,
        coordinates: { x: 35, y: 65 },
        salesVolume: 23,
        newListings: 9
      },
      {
        zipCode: '77007',
        neighborhood: 'Near Northside',
        avgPrice: 285000,
        priceChange: 13.8,
        activity: 'high',
        inventory: 16.7,
        daysOnMarket: 29,
        coordinates: { x: 52, y: 30 },
        salesVolume: 48,
        newListings: 16
      },
      {
        zipCode: '77092',
        neighborhood: 'Northwest',
        avgPrice: 245000,
        priceChange: 2.1,
        activity: 'low',
        inventory: 45.3,
        daysOnMarket: 58,
        coordinates: { x: 20, y: 20 },
        salesVolume: 12,
        newListings: 8
      },
      {
        zipCode: '77081',
        neighborhood: 'Southwest',
        avgPrice: 195000,
        priceChange: -1.2,
        activity: 'low',
        inventory: 52.1,
        daysOnMarket: 67,
        coordinates: { x: 15, y: 70 },
        salesVolume: 9,
        newListings: 5
      }
    ];

    // Add some market summary statistics
    const summary = {
      totalNeighborhoods: heatMapData.length,
      hotMarkets: heatMapData.filter(item => item.activity === 'hot').length,
      avgPrice: Math.round(heatMapData.reduce((sum, item) => sum + item.avgPrice, 0) / heatMapData.length),
      avgPriceChange: Number((heatMapData.reduce((sum, item) => sum + item.priceChange, 0) / heatMapData.length).toFixed(1)),
      totalSalesVolume: heatMapData.reduce((sum, item) => sum + item.salesVolume, 0),
      totalNewListings: heatMapData.reduce((sum, item) => sum + item.newListings, 0)
    };

    return NextResponse.json({
      success: true,
      data: heatMapData,
      summary,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Market heatmap API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market heatmap data' },
      { status: 500 }
    );
  }
}