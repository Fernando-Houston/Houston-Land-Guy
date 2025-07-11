import axios from 'axios';
import useSWR from 'swr';
import { useCallback } from 'react';
import type {
  MarketData,
  NeighborhoodData,
  PropertyAnalysisData,
  MarketTimingData,
  ROICalculationRequest,
  ROICalculationResponse,
  LeadData,
  LeadResponse,
  SaveCalculationRequest,
  SaveCalculationResponse,
  CalculationHistoryResponse
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// SWR fetcher
const fetcher = (url: string) => api.get(url).then(res => res.data);

// Custom hooks
export function useMarketData(neighborhood?: string) {
  const { data, error, isLoading, mutate } = useSWR<MarketData>(
    neighborhood ? `/core-agents/market-intelligence?neighborhood=${neighborhood}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useNeighborhoodComparison(neighborhoods: string[]) {
  const { data, error, isLoading } = useSWR<NeighborhoodData>(
    neighborhoods.length > 0 
      ? `/core-agents/neighborhood-comparison?neighborhoods=${neighborhoods.join(',')}` 
      : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

export function usePropertyAnalysis(address: string) {
  const { data, error, isLoading } = useSWR<PropertyAnalysisData>(
    address ? `/core-agents/property-analysis?address=${encodeURIComponent(address)}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

// API mutation hooks
export function useROICalculation() {
  const calculate = useCallback(async (data: ROICalculationRequest): Promise<ROICalculationResponse> => {
    try {
      const response = await api.post<ROICalculationResponse>('/tools/roi-calculator', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  return { calculate };
}

export function useLeadCapture() {
  const capture = useCallback(async (leadData: LeadData): Promise<LeadResponse> => {
    try {
      const response = await api.post<LeadResponse>('/leads', leadData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  return { capture };
}

export function useSaveCalculation() {
  const save = useCallback(async (calculation: SaveCalculationRequest): Promise<SaveCalculationResponse> => {
    try {
      const response = await api.post<SaveCalculationResponse>('/calculations/save', calculation);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  return { save };
}

// Market timing indicators
export function useMarketTiming() {
  const { data, error, isLoading } = useSWR<MarketTimingData>(
    '/core-agents/market-timing',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // 5 minutes
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}

// Historical calculations
export function useCalculationHistory(userId?: string) {
  const { data, error, isLoading } = useSWR<CalculationHistoryResponse>(
    userId ? `/calculations/history?userId=${userId}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

// Export the api instance for direct use
export { api };