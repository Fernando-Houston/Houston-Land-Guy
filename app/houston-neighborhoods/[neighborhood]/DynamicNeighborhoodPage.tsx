'use client'

import React, { Fragment } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, MapPin, TrendingUp, Users, School, Home, Building2, Download, Clock, Droplet, TreePine, DollarSign, Zap } from 'lucide-react'
import { NeighborhoodData, MarketMetrics, MarketTiming, PermitActivity } from '@/lib/core-agents/types'
import { MarketMetricsCard } from '@/components/market/MarketMetricsCard'
import { PermitActivityChart } from '@/components/market/PermitActivityChart'
import { DemographicsCard } from '@/components/market/DemographicsCard'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { PropertyMap } from '@/components/maps/MapWrapper'
import Script from 'next/script'
import { useEffect, useState } from 'react'

interface DynamicNeighborhoodPageProps {
  neighborhoodData: NeighborhoodData
  marketMetrics: MarketMetrics
  marketTiming: MarketTiming
  permitData: PermitActivity
}

interface AreaInsights {
  market?: any
  environmental?: any
  tech?: any
  residential?: any
  commercial?: any
}

// Helper function to get neighborhood center coordinates
function getNeighborhoodCenter(slug: string): { lat: number; lng: number } {
  const centers: Record<string, { lat: number; lng: number }> = {
    'cypress': { lat: 29.9691, lng: -95.6972 },
    'pearland': { lat: 29.5635, lng: -95.2860 },
    'memorial': { lat: 29.7641, lng: -95.4674 },
    'spring': { lat: 30.0799, lng: -95.4172 },
    'conroe': { lat: 30.3119, lng: -95.4560 },
    'richmond': { lat: 29.5819, lng: -95.7605 },
    'friendswood': { lat: 29.5294, lng: -95.2010 },
    'league-city': { lat: 29.5075, lng: -95.0949 },
    'clear-lake': { lat: 29.5768, lng: -95.1204 },
    'bellaire': { lat: 29.7058, lng: -95.4588 },
    'river-oaks': { lat: 29.7573, lng: -95.4151 },
    'heights': { lat: 29.7989, lng: -95.3987 },
    'montrose': { lat: 29.7472, lng: -95.3902 },
    'energy-corridor': { lat: 29.7836, lng: -95.6347 },
    'champions': { lat: 30.0360, lng: -95.5087 }
  }
  
  return centers[slug] || { lat: 29.7604, lng: -95.3698 } // Default to Houston center
}

export function DynamicNeighborhoodPage({ 
  neighborhoodData, 
  marketMetrics, 
  marketTiming,
  permitData 
}: DynamicNeighborhoodPageProps) {
  const [areaInsights, setAreaInsights] = useState<AreaInsights>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadAreaData = async () => {
      try {
        // Use fallback insights for now
        const insights = {
          market: {
            averagePrice: neighborhoodData.medianHomePrice,
            priceGrowth: neighborhoodData.growthRate
          },
          environmental: {
            walkScore: 65,
            transitScore: 45
          },
          tech: {
            fiberAvailability: '85%',
            avgInternetSpeed: '150 Mbps'
          }
        };
        setAreaInsights(insights);
      } catch (error) {
        console.error('Error loading area insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAreaData();
  }, [neighborhoodData.name, neighborhoodData.medianHomePrice, neighborhoodData.growthRate]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${neighborhoodData.name}, Houston, TX`,
    description: `${neighborhoodData.name} is a thriving neighborhood in Houston with a median home price of $${(neighborhoodData.medianHomePrice / 1000).toFixed(0)}K and ${neighborhoodData.growthRate}% annual growth rate.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '29.7604',
      longitude: '-95.3698'
    },
    containedInPlace: {
      '@type': 'City',
      name: 'Houston',
      containedInPlace: {
        '@type': 'State',
        name: 'Texas'
      }
    },
    hasMap: `https://maps.google.com/?q=${neighborhoodData.name}+Houston+TX`
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {neighborhoodData.name} Development Opportunities
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Discover premium development sites in one of Houston's most dynamic neighborhoods with{' '}
            <span className="font-semibold text-green-600">{neighborhoodData.growthRate}% annual growth</span> and{' '}
            <span className="font-semibold text-green-600">${(neighborhoodData.medianHomePrice / 1000).toFixed(0)}K median home prices</span>.
          </p>
        </div>
      </section>
    </div>
  );
}