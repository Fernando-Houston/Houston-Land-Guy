export interface PropertyDetails {
  address: string;
  lat: number;
  lng: number;
  lotSize: number;
  currentValue: number;
  zoning: string;
  neighborhood: string;
}

export interface DevelopmentCosts {
  landAcquisition: number;
  construction: number;
  permits: number;
  utilities: number;
  contingency: number;
  financing: number;
  total: number;
}

export interface ROIProjection {
  totalInvestment: number;
  projectedRevenue: number;
  netProfit: number;
  roi: number;
  paybackPeriod: number;
  irr: number;
  timeline: {
    phase: string;
    duration: number;
    startMonth: number;
    endMonth: number;
  }[];
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: 'residential' | 'commercial' | 'mixed-use';
  investmentRange: string;
  timeframe: string;
}

export interface MarketData {
  avgPricePerSqFt: number;
  growthRate: number;
  daysOnMarket: number;
  inventoryLevel: number;
  demandScore: number;
  comparables: {
    address: string;
    price: number;
    sqft: number;
    soldDate: string;
  }[];
}