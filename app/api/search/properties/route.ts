import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SearchFilters {
  query?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqftMin?: number;
  sqftMax?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  status?: string;
  sortBy?: string;
  listingType?: string;
  limit?: number;
  offset?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: SearchFilters = {
      query: searchParams.get('query') || undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      neighborhood: searchParams.get('neighborhood') || undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      bathrooms: searchParams.get('bathrooms') ? parseFloat(searchParams.get('bathrooms')!) : undefined,
      sqftMin: searchParams.get('sqftMin') ? parseInt(searchParams.get('sqftMin')!) : undefined,
      sqftMax: searchParams.get('sqftMax') ? parseInt(searchParams.get('sqftMax')!) : undefined,
      yearBuiltMin: searchParams.get('yearBuiltMin') ? parseInt(searchParams.get('yearBuiltMin')!) : undefined,
      yearBuiltMax: searchParams.get('yearBuiltMax') ? parseInt(searchParams.get('yearBuiltMax')!) : undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || 'newest',
      listingType: searchParams.get('listingType') || 'all',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    // Mock property data for demonstration
    // In production, this would query the Property model with proper filters
    const mockProperties = [
      {
        id: 'prop_1',
        address: '1234 Heights Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77008',
        neighborhood: 'The Heights',
        propertyType: 'Single Family',
        status: 'For Sale',
        listPrice: 485000,
        soldPrice: null,
        pricePerSqft: 262,
        squareFeet: 1850,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2018,
        lotSize: 0.15,
        listDate: new Date('2024-01-15'),
        soldDate: null,
        features: ['Hardwood Floors', 'Updated Kitchen', 'Fenced Yard'],
        amenities: ['Garage', 'Patio'],
        coordinates: { lat: 29.7937, lng: -95.3974 },
        images: ['/properties/heights-1.jpg'],
        description: 'Beautiful modern home in the heart of The Heights',
        mlsNumber: 'HAR12345678',
        daysOnMarket: 22,
        priceHistory: [
          { date: '2024-01-15', price: 485000, event: 'Listed' }
        ]
      },
      {
        id: 'prop_2',
        address: '5678 Memorial Dr',
        city: 'Houston',
        state: 'TX',
        zipCode: '77024',
        neighborhood: 'Memorial',
        propertyType: 'Townhouse',
        status: 'For Sale',
        listPrice: 725000,
        soldPrice: null,
        pricePerSqft: 302,
        squareFeet: 2400,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 2020,
        lotSize: 0.08,
        listDate: new Date('2024-01-12'),
        soldDate: null,
        features: ['Gourmet Kitchen', 'Master Suite', 'Two-Car Garage'],
        amenities: ['Community Pool', 'Playground'],
        coordinates: { lat: 29.7654, lng: -95.4618 },
        images: ['/properties/memorial-1.jpg'],
        description: 'Luxury townhouse in gated Memorial community',
        mlsNumber: 'HAR12345679',
        daysOnMarket: 25,
        priceHistory: [
          { date: '2024-01-12', price: 725000, event: 'Listed' }
        ]
      },
      {
        id: 'prop_3',
        address: '910 River Oaks Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77019',
        neighborhood: 'River Oaks',
        propertyType: 'Single Family',
        status: 'For Sale',
        listPrice: 2850000,
        soldPrice: null,
        pricePerSqft: 679,
        squareFeet: 4200,
        bedrooms: 5,
        bathrooms: 4.5,
        yearBuilt: 2015,
        lotSize: 0.33,
        listDate: new Date('2024-01-10'),
        soldDate: null,
        features: ['Wine Cellar', 'Library', 'Butler\'s Pantry', 'Pool'],
        amenities: ['3-Car Garage', 'Guest House'],
        coordinates: { lat: 29.7370, lng: -95.4019 },
        images: ['/properties/riveroaks-1.jpg'],
        description: 'Magnificent estate home in prestigious River Oaks',
        mlsNumber: 'HAR12345680',
        daysOnMarket: 28,
        priceHistory: [
          { date: '2024-01-10', price: 2850000, event: 'Listed' }
        ]
      },
      {
        id: 'prop_4',
        address: '2468 Montrose St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77098',
        neighborhood: 'Montrose',
        propertyType: 'Condo',
        status: 'For Sale',
        listPrice: 385000,
        soldPrice: null,
        pricePerSqft: 321,
        squareFeet: 1200,
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2019,
        lotSize: null,
        listDate: new Date('2024-01-08'),
        soldDate: null,
        features: ['City Views', 'Balcony', 'In-Unit Laundry'],
        amenities: ['Rooftop Deck', 'Fitness Center', 'Concierge'],
        coordinates: { lat: 29.7342, lng: -95.3840 },
        images: ['/properties/montrose-1.jpg'],
        description: 'Modern high-rise condo with stunning city views',
        mlsNumber: 'HAR12345681',
        daysOnMarket: 30,
        priceHistory: [
          { date: '2024-01-08', price: 385000, event: 'Listed' }
        ]
      },
      {
        id: 'prop_5',
        address: '1357 Midtown Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77027',
        neighborhood: 'Midtown',
        propertyType: 'Condo',
        status: 'Sold',
        listPrice: 420000,
        soldPrice: 415000,
        pricePerSqft: 300,
        squareFeet: 1383,
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2021,
        lotSize: null,
        listDate: new Date('2023-12-15'),
        soldDate: new Date('2024-01-05'),
        features: ['Floor-to-Ceiling Windows', 'Granite Counters'],
        amenities: ['Pool', 'Gym', 'Parking Garage'],
        coordinates: { lat: 29.7326, lng: -95.3671 },
        images: ['/properties/midtown-1.jpg'],
        description: 'Contemporary condo in vibrant Midtown',
        mlsNumber: 'HAR12345682',
        daysOnMarket: 21,
        priceHistory: [
          { date: '2023-12-15', price: 420000, event: 'Listed' },
          { date: '2024-01-05', price: 415000, event: 'Sold' }
        ]
      }
    ];

    // Apply filters
    let filteredProperties = [...mockProperties];

    // Text search
    if (filters.query) {
      const queryLower = filters.query.toLowerCase();
      filteredProperties = filteredProperties.filter(prop =>
        prop.address.toLowerCase().includes(queryLower) ||
        prop.neighborhood.toLowerCase().includes(queryLower) ||
        prop.city.toLowerCase().includes(queryLower) ||
        prop.zipCode.includes(filters.query!) ||
        (prop.mlsNumber && prop.mlsNumber.toLowerCase().includes(queryLower))
      );
    }

    // Price range
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.listPrice || 0) >= filters.priceMin!
      );
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.listPrice || 0) <= filters.priceMax!
      );
    }

    // Property type
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(prop =>
        prop.propertyType === filters.propertyType
      );
    }

    // Neighborhood
    if (filters.neighborhood) {
      filteredProperties = filteredProperties.filter(prop =>
        prop.neighborhood === filters.neighborhood
      );
    }

    // Bedrooms
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.bedrooms || 0) >= filters.bedrooms!
      );
    }

    // Bathrooms
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.bathrooms || 0) >= filters.bathrooms!
      );
    }

    // Square footage
    if (filters.sqftMin) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.squareFeet || 0) >= filters.sqftMin!
      );
    }
    if (filters.sqftMax) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.squareFeet || 0) <= filters.sqftMax!
      );
    }

    // Year built
    if (filters.yearBuiltMin) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.yearBuilt || 0) >= filters.yearBuiltMin!
      );
    }
    if (filters.yearBuiltMax) {
      filteredProperties = filteredProperties.filter(prop =>
        (prop.yearBuilt || 0) <= filters.yearBuiltMax!
      );
    }

    // Status/Listing type
    if (filters.listingType && filters.listingType !== 'all') {
      switch (filters.listingType) {
        case 'for-sale':
          filteredProperties = filteredProperties.filter(prop => prop.status === 'For Sale');
          break;
        case 'sold':
          filteredProperties = filteredProperties.filter(prop => prop.status === 'Sold');
          break;
        case 'off-market':
          filteredProperties = filteredProperties.filter(prop => prop.status === 'Off Market');
          break;
      }
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filteredProperties.sort((a, b) => (a.listPrice || 0) - (b.listPrice || 0));
        break;
      case 'price-high':
        filteredProperties.sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0));
        break;
      case 'sqft-large':
        filteredProperties.sort((a, b) => (b.squareFeet || 0) - (a.squareFeet || 0));
        break;
      case 'newest':
      default:
        filteredProperties.sort((a, b) => {
          const dateA = a.listDate ? new Date(a.listDate).getTime() : 0;
          const dateB = b.listDate ? new Date(b.listDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    // Apply pagination
    const total = filteredProperties.length;
    const paginatedProperties = filteredProperties.slice(
      filters.offset || 0,
      (filters.offset || 0) + (filters.limit || 20)
    );

    // Calculate aggregations
    const aggregations = {
      totalProperties: total,
      averagePrice: total > 0 ? Math.round(filteredProperties.reduce((sum, prop) => sum + (prop.listPrice || 0), 0) / total) : 0,
      priceRange: {
        min: total > 0 ? Math.min(...filteredProperties.map(prop => prop.listPrice || 0)) : 0,
        max: total > 0 ? Math.max(...filteredProperties.map(prop => prop.listPrice || 0)) : 0
      },
      neighborhoods: [...new Set(filteredProperties.map(prop => prop.neighborhood))],
      propertyTypes: [...new Set(filteredProperties.map(prop => prop.propertyType))]
    };

    return NextResponse.json({
      success: true,
      properties: paginatedProperties,
      pagination: {
        total,
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        hasMore: ((filters.offset || 0) + (filters.limit || 20)) < total
      },
      aggregations,
      filters: filters
    });

  } catch (error) {
    console.error('Property search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, searchName, filters } = body;

    if (!searchName || !filters) {
      return NextResponse.json(
        { success: false, error: 'Search name and filters are required' },
        { status: 400 }
      );
    }

    // In production, this would save to SavedSearch model
    const savedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || 'demo_user',
      name: searchName,
      criteria: filters,
      alertsEnabled: true,
      lastRun: new Date(),
      resultCount: 0,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      savedSearch,
      message: 'Search saved successfully'
    });

  } catch (error) {
    console.error('Save search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save search' },
      { status: 500 }
    );
  }
}