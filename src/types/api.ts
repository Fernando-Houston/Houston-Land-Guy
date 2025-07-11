// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

// Market Intelligence Types
export interface MarketData {
  currentMetrics: {
    avgPricePerSqFt: number;
    priceChange: number;
    daysOnMarket: number;
    domChange: number;
    activeListings: number;
    listingsChange: number;
    soldListings: number;
    soldChange: number;
  };
  priceHistory: Array<{
    date: string;
    avgPrice: number;
  }>;
  propertyTypeDistribution: Array<{
    name: string;
    value: number;
  }>;
  insights: string[];
}

// Neighborhood Types
export interface NeighborhoodData {
  neighborhoods: Array<{
    name: string;
    avgPricePerSqFt: number;
    yearOverYearGrowth: number;
    inventoryLevel: number;
    demandScore: number;
  }>;
}

// Property Analysis Types
export interface PropertyAnalysisData {
  estimatedValue: number;
  lotSize: number;
  zoning: string;
  neighborhood: string;
  comparables: Array<{
    address: string;
    price: number;
    sqft: number;
    soldDate: string;
  }>;
}

// Market Timing Types
export interface MarketTimingData {
  overallScore: number;
  buyScore: number;
  sellScore: number;
  holdScore: number;
  indicators: Array<{
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

// ROI Calculation Types
export interface ROICalculationRequest {
  property: {
    address: string;
    lat: number;
    lng: number;
    lotSize: number;
    currentValue: number;
    zoning: string;
    neighborhood: string;
  };
  projectType: 'residential' | 'commercial' | 'mixed-use';
  buildingSqFt: number;
  qualityLevel: 'low' | 'mid' | 'high';
  financingType: 'cash' | 'loan';
  loanTerms?: {
    downPayment: number;
    interestRate: number;
    loanTerm: number;
  };
  userId?: string;
}

export interface ROICalculationResponse {
  id: string;
  costs: {
    landAcquisition: number;
    construction: number;
    permits: number;
    utilities: number;
    contingency: number;
    financing: number;
    total: number;
  };
  projection: {
    totalInvestment: number;
    projectedRevenue: number;
    netProfit: number;
    roi: number;
    paybackPeriod: number;
    irr: number;
    timeline: Array<{
      phase: string;
      duration: number;
      startMonth: number;
      endMonth: number;
    }>;
  };
}

// Lead Types
export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  interest: string;
  source: string;
  timestamp?: string;
  propertyAddress?: string;
  calculationId?: string;
  calculatedROI?: number;
  totalInvestment?: number;
}

export interface LeadResponse {
  id: string;
  status: 'captured' | 'processed' | 'contacted';
  message: string;
}

// Calculation Save Types
export interface SaveCalculationRequest {
  calculationId: string;
  userId?: string;
}

export interface SaveCalculationResponse {
  id: string;
  saved: boolean;
  message: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp?: string;
  userId?: string;
}

// Calculation History Types
export interface CalculationHistoryItem {
  id: string;
  propertyAddress: string;
  roi: number;
  totalInvestment: number;
  createdAt: string;
  projectType: string;
}

export interface CalculationHistoryResponse {
  calculations: CalculationHistoryItem[];
  total: number;
  page: number;
  limit: number;
}