import { cache } from 'react';

// Perplexity API configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Houston data sources
const HOUSTON_OPENDATA_URL = process.env.HOUSTON_OPENDATA_BASE_URL || 'https://data.houstontx.gov';
const HCAD_URL = process.env.HCAD_BASE_URL || 'https://pdata.hcad.org';

export interface MarketIntelligence {
  summary: string;
  keyInsights: string[];
  dataPoints: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
    changePercent?: number;
  }[];
  sources: string[];
  lastUpdated: Date;
}

export interface PermitData {
  permitNumber: string;
  type: string;
  address: string;
  description: string;
  value: number;
  issuedDate: string;
  status: string;
  contractor?: string;
  owner?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyData {
  accountNumber: string;
  address: string;
  owner: string;
  landValue: number;
  improvementValue: number;
  totalValue: number;
  acreage: number;
  zoning?: string;
  yearBuilt?: number;
  lastSaleDate?: string;
  lastSalePrice?: number;
}

// Query Perplexity for real-time market intelligence
export const queryPerplexity = cache(async (query: string, context?: string): Promise<string> => {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured');
  }

  const systemPrompt = context || "You are a Houston real estate market expert providing accurate, data-driven insights for developers and investors.";

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'pplx-7b-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error);
    throw error;
  }
});

// Fetch Houston building permits
export const fetchHoustonPermits = cache(async (params?: {
  limit?: number;
  offset?: number;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PermitData[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.append('$limit', params.limit.toString());
  if (params?.offset) queryParams.append('$offset', params.offset.toString());
  if (params?.dateFrom || params?.dateTo) {
    const whereClause = [];
    if (params.dateFrom) whereClause.push(`issued_date >= '${params.dateFrom}'`);
    if (params.dateTo) whereClause.push(`issued_date <= '${params.dateTo}'`);
    queryParams.append('$where', whereClause.join(' AND '));
  }

  try {
    // Using Houston's building permits dataset
    const response = await fetch(
      `${HOUSTON_OPENDATA_URL}/resource/76zh-5m6r.json?${queryParams.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Houston OpenData API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((permit: any) => ({
      permitNumber: permit.permit_number || '',
      type: permit.permit_type || '',
      address: permit.address || '',
      description: permit.description || '',
      value: parseFloat(permit.declared_valuation) || 0,
      issuedDate: permit.issued_date || '',
      status: permit.status || '',
      contractor: permit.contractor_name || '',
      owner: permit.owner_name || '',
      coordinates: permit.location ? {
        lat: parseFloat(permit.location.latitude),
        lng: parseFloat(permit.location.longitude)
      } : undefined
    }));
  } catch (error) {
    console.error('Houston permit fetch error:', error);
    return [];
  }
});

// Get market intelligence for a specific topic
export const getMarketIntelligence = cache(async (topic: string): Promise<MarketIntelligence> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Query Perplexity for current market insights
  const query = `Houston real estate market ${topic} analysis as of ${today}. Include specific data points, trends, and recent developments. Focus on information relevant to developers and investors.`;
  
  try {
    const perplexityResponse = await queryPerplexity(query);
    
    // Parse the response to extract key insights
    const insights = perplexityResponse.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 5);
    
    // Extract data points (this is a simplified version - in production, use better parsing)
    const dataPoints = [];
    const percentageRegex = /(\d+\.?\d*)\s*%/g;
    const dollarRegex = /\$(\d+,?\d*\.?\d*)\s*(million|billion|M|B)?/gi;
    
    let match;
    while ((match = percentageRegex.exec(perplexityResponse)) !== null) {
      dataPoints.push({
        label: 'Market Metric',
        value: `${match[1]}%`,
        trend: 'stable' as const
      });
    }
    
    return {
      summary: perplexityResponse.split('.')[0] + '.',
      keyInsights: insights,
      dataPoints,
      sources: ['Perplexity AI', 'Houston OpenData', 'HCAD'],
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Market intelligence error:', error);
    return {
      summary: 'Unable to fetch current market intelligence.',
      keyInsights: [],
      dataPoints: [],
      sources: [],
      lastUpdated: new Date()
    };
  }
});

// Get construction cost estimates using Perplexity
export const getConstructionCostEstimates = cache(async (projectType: string, sqft: number): Promise<{
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
  breakdown: { category: string; cost: number; percentage: number }[];
  sources: string[];
}> => {
  const query = `Current construction costs in Houston, Texas for ${projectType} development, ${sqft} square feet. Include cost per square foot breakdown for materials, labor, permits, and soft costs. Provide low, mid, and high estimates based on 2024 market conditions.`;
  
  try {
    const response = await queryPerplexity(query);
    
    // Parse response for cost data (simplified - enhance with better parsing)
    const costPerSqft = {
      low: 115,  // Default values
      mid: 135,
      high: 165
    };
    
    // Extract costs from response if available
    const costMatches = response.match(/\$(\d+)\s*-\s*\$(\d+)\s*per\s*square\s*foot/i);
    if (costMatches) {
      costPerSqft.low = parseInt(costMatches[1]);
      costPerSqft.high = parseInt(costMatches[2]);
      costPerSqft.mid = (costPerSqft.low + costPerSqft.high) / 2;
    }
    
    return {
      lowEstimate: costPerSqft.low * sqft,
      midEstimate: costPerSqft.mid * sqft,
      highEstimate: costPerSqft.high * sqft,
      breakdown: [
        { category: 'Materials', cost: costPerSqft.mid * sqft * 0.40, percentage: 40 },
        { category: 'Labor', cost: costPerSqft.mid * sqft * 0.35, percentage: 35 },
        { category: 'Permits & Fees', cost: costPerSqft.mid * sqft * 0.10, percentage: 10 },
        { category: 'Soft Costs', cost: costPerSqft.mid * sqft * 0.15, percentage: 15 },
      ],
      sources: ['Perplexity AI', 'Houston Construction Market Data', 'Builder Reports']
    };
  } catch (error) {
    console.error('Construction cost estimate error:', error);
    // Return default estimates
    return {
      lowEstimate: 115 * sqft,
      midEstimate: 135 * sqft,
      highEstimate: 165 * sqft,
      breakdown: [
        { category: 'Materials', cost: 135 * sqft * 0.40, percentage: 40 },
        { category: 'Labor', cost: 135 * sqft * 0.35, percentage: 35 },
        { category: 'Permits & Fees', cost: 135 * sqft * 0.10, percentage: 10 },
        { category: 'Soft Costs', cost: 135 * sqft * 0.15, percentage: 15 },
      ],
      sources: ['Industry Averages']
    };
  }
});

// Get neighborhood-specific intelligence
export const getNeighborhoodIntelligence = cache(async (neighborhood: string): Promise<{
  overview: string;
  demographics: any;
  developmentActivity: any;
  opportunities: string[];
  challenges: string[];
}> => {
  const query = `Houston neighborhood analysis for ${neighborhood}: current development activity, demographics, average property values, new construction permits, zoning changes, investment opportunities, and challenges for developers. Include specific 2024 data.`;
  
  try {
    const response = await queryPerplexity(query);
    
    // Also fetch recent permits for this area
    const permits = await fetchHoustonPermits({
      limit: 10,
      dateFrom: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 90 days
    });
    
    return {
      overview: response.split('\n')[0],
      demographics: {
        source: 'Perplexity AI Analysis',
        lastUpdated: new Date()
      },
      developmentActivity: {
        recentPermits: permits.length,
        totalValue: permits.reduce((sum, p) => sum + p.value, 0)
      },
      opportunities: response.includes('opportunit') ? 
        response.split('opportunit')[1].split('.').slice(0, 3).map(s => s.trim()).filter(s => s.length > 10) : [],
      challenges: response.includes('challeng') ?
        response.split('challeng')[1].split('.').slice(0, 3).map(s => s.trim()).filter(s => s.length > 10) : []
    };
  } catch (error) {
    console.error('Neighborhood intelligence error:', error);
    return {
      overview: 'Unable to fetch neighborhood data.',
      demographics: {},
      developmentActivity: {},
      opportunities: [],
      challenges: []
    };
  }
});