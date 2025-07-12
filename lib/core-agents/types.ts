// Core Agent Types for Houston Development Intelligence

export interface MarketMetrics {
  averagePricePerSqFt: number;
  medianPrice: number;
  yearOverYearChange: number;
  daysOnMarket: number;
  activeListings: number;
  newListings: number;
  soldProperties: number;
  inventoryMonths: number;
  listToSoldRatio: number;
  timestamp: Date;
}

export interface NeighborhoodData {
  name: string;
  slug: string;
  county: string;
  population: number;
  medianIncome: number;
  medianHomePrice: number;
  pricePerSqFt: number;
  yearBuilt: number;
  schoolRating: number;
  crimeRate: number;
  walkScore: number;
  transitScore: number;
  growthRate: number;
  demographics: Demographics;
  marketMetrics: MarketMetrics;
  permitData: PermitActivity;
  amenities: string[];
  topEmployers: string[];
  upcomingDevelopments: Development[];
}

export interface Demographics {
  ageDistribution: {
    under18: number;
    '18-34': number;
    '35-54': number;
    '55-64': number;
    over65: number;
  };
  householdIncome: {
    under50k: number;
    '50k-100k': number;
    '100k-150k': number;
    '150k-200k': number;
    over200k: number;
  };
  education: {
    highSchool: number;
    bachelors: number;
    masters: number;
    doctorate: number;
  };
  householdSize: number;
  ownerOccupied: number;
  renterOccupied: number;
}

export interface PermitActivity {
  totalPermits: number;
  totalValue: number;
  residential: {
    count: number;
    value: number;
  };
  commercial: {
    count: number;
    value: number;
  };
  industrial: {
    count: number;
    value: number;
  };
  mixedUse: {
    count: number;
    value: number;
  };
  topProjects: PermitProject[];
  monthlyTrend: Array<{
    month: string;
    count: number;
    value: number;
  }>;
}

export interface PermitProject {
  address: string;
  type: string;
  value: number;
  sqft: number;
  status: string;
  developer: string;
  expectedCompletion: string;
}

export interface Development {
  name: string;
  type: string;
  size: string;
  investmentValue: number;
  expectedCompletion: string;
  developer: string;
  description: string;
}

export interface MarketTiming {
  score: number; // 0-100
  recommendation: 'BUY' | 'HOLD' | 'SELL' | 'WATCH';
  factors: {
    priceAppreciation: number;
    inventory: number;
    demandSupply: number;
    economicIndicators: number;
    seasonality: number;
  };
  insights: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  type: string;
  price: number;
  size: number;
  projectedROI: number;
  highlights: string[];
  risks: string[];
  timeline: string;
  minimumInvestment: number;
  targetIRR: number;
  exitStrategy: string;
  images: string[];
}

export interface PropertyAnalysis {
  address: string;
  parcelId: string;
  zoning: string;
  currentUse: string;
  highestBestUse: string;
  landValue: number;
  improvementValue: number;
  totalValue: number;
  taxAssessment: number;
  annualTaxes: number;
  lotSize: number;
  buildableArea: number;
  developmentPotential: DevelopmentPotential;
  comparables: Comparable[];
}

export interface DevelopmentPotential {
  residential: {
    units: number;
    type: string;
    estimatedValue: number;
    constructionCost: number;
    netROI: number;
  };
  commercial: {
    sqft: number;
    type: string;
    estimatedValue: number;
    constructionCost: number;
    netROI: number;
  };
  mixedUse: {
    residentialUnits: number;
    commercialSqft: number;
    estimatedValue: number;
    constructionCost: number;
    netROI: number;
  };
  recommendation: string;
}

export interface Comparable {
  address: string;
  distance: number;
  soldDate: string;
  soldPrice: number;
  pricePerSqFt: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
}

export interface MarketReport {
  id: string;
  title: string;
  date: Date;
  quarter: string;
  year: number;
  summary: string;
  keyMetrics: {
    totalPermitValue: number;
    permitCount: number;
    avgROI: number;
    topNeighborhoods: string[];
    growthRate: number;
  };
  sections: ReportSection[];
  charts: ChartData[];
}

export interface ReportSection {
  title: string;
  content: string;
  highlights: string[];
  data: any;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any;
  config: any;
}

export interface CoreAgentResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: Date;
  cached: boolean;
  ttl?: number;
}