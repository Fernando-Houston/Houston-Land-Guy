import type { ApiResponse } from '@/types/api';

const CORE_AGENTS_API = process.env.NEXT_PUBLIC_CORE_AGENTS_API || 'https://core-agents-6d4f5.up.railway.app';
const API_KEY = process.env.NEXT_PUBLIC_CORE_AGENTS_KEY || '16d076af50e4067c252d09321d76c33bd06218fafea855fe427954098dd227b7';

// Property coordinates interface
interface PropertyCoordinates {
  lat: number;
  lng: number;
}

// Property data interface
interface PropertyData {
  address: string;
  coordinates: PropertyCoordinates;
  lotSize?: number;
  currentValue?: number;
  zoning?: string;
  neighborhood?: string;
}

export class CoreAgentsAPI {
  private static async fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${CORE_AGENTS_API}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { data, status: 'success' };
    } catch (error) {
      console.error('Core Agents API Error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error'
      };
    }
  }

  static async getMarketIntelligence(address: string) {
    return this.fetchWithAuth<Record<string, unknown>>('/api/v1/market_intelligence', {
      method: 'POST',
      body: JSON.stringify({ address, analysis_type: 'property_assessment' })
    });
  }

  static async getFinancialAnalysis(propertyData: PropertyData) {
    return this.fetchWithAuth<Record<string, unknown>>('/api/v1/financial_intelligence', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  static async getNeighborhoodData(coordinates: PropertyCoordinates) {
    return this.fetchWithAuth<Record<string, unknown>>('/api/v1/neighborhood_intelligence', {
      method: 'POST',
      body: JSON.stringify({ coordinates })
    });
  }

  static async getRegulatoryInfo(address: string) {
    return this.fetchWithAuth<Record<string, unknown>>('/api/v1/regulatory_intelligence', {
      method: 'POST',
      body: JSON.stringify({ address })
    });
  }

  static async submitLead(leadData: Record<string, unknown>) {
    return this.fetchWithAuth<Record<string, unknown>>('/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  }
}