'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, MapPin, DollarSign, Home, Calendar, TrendingUp, Sliders } from 'lucide-react';

interface SearchFilters {
  query: string;
  priceMin: string;
  priceMax: string;
  propertyType: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  sqftMin: string;
  sqftMax: string;
  yearBuiltMin: string;
  yearBuiltMax: string;
  status: string;
  sortBy: string;
  listingType: string;
}

interface SearchResult {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  status: string;
  listDate: string;
  imageUrl?: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  priceMin: '',
  priceMax: '',
  propertyType: '',
  neighborhood: '',
  bedrooms: '',
  bathrooms: '',
  sqftMin: '',
  sqftMax: '',
  yearBuiltMin: '',
  yearBuiltMax: '',
  status: '',
  sortBy: 'newest',
  listingType: 'all'
};

export default function AdvancedSearchBar() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved searches:', error);
      }
    }
  }, []);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      address: '1234 Heights Blvd, Houston, TX 77008',
      neighborhood: 'The Heights',
      price: 485000,
      sqft: 1850,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Single Family',
      status: 'For Sale',
      listDate: '2024-01-15'
    },
    {
      id: '2',
      address: '5678 Memorial Dr, Houston, TX 77024',
      neighborhood: 'Memorial',
      price: 725000,
      sqft: 2400,
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'Townhouse',
      status: 'For Sale',
      listDate: '2024-01-12'
    },
    {
      id: '3',
      address: '910 River Oaks Blvd, Houston, TX 77019',
      neighborhood: 'River Oaks',
      price: 2850000,
      sqft: 4200,
      bedrooms: 5,
      bathrooms: 4.5,
      propertyType: 'Single Family',
      status: 'For Sale',
      listDate: '2024-01-10'
    },
    {
      id: '4',
      address: '2468 Montrose St, Houston, TX 77098',
      neighborhood: 'Montrose',
      price: 385000,
      sqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
      propertyType: 'Condo',
      status: 'For Sale',
      listDate: '2024-01-08'
    }
  ];

  const neighborhoods = [
    'River Oaks', 'Memorial', 'The Heights', 'Montrose', 'Midtown',
    'Medical Center', 'Galleria', 'West University', 'Rice Village',
    'Bellaire', 'Sugar Land', 'The Woodlands', 'Katy', 'Cypress'
  ];

  const propertyTypes = [
    'Single Family', 'Townhouse', 'Condo', 'Multi-Family',
    'Land', 'Commercial', 'Investment'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setShowResults(true);

    // Simulate API call
    setTimeout(() => {
      let filteredResults = [...mockResults];

      // Apply filters
      if (filters.query) {
        filteredResults = filteredResults.filter(result =>
          result.address.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.neighborhood.toLowerCase().includes(filters.query.toLowerCase())
        );
      }

      if (filters.priceMin) {
        filteredResults = filteredResults.filter(result =>
          result.price >= parseInt(filters.priceMin)
        );
      }

      if (filters.priceMax) {
        filteredResults = filteredResults.filter(result =>
          result.price <= parseInt(filters.priceMax)
        );
      }

      if (filters.neighborhood) {
        filteredResults = filteredResults.filter(result =>
          result.neighborhood === filters.neighborhood
        );
      }

      if (filters.propertyType) {
        filteredResults = filteredResults.filter(result =>
          result.propertyType === filters.propertyType
        );
      }

      if (filters.bedrooms) {
        filteredResults = filteredResults.filter(result =>
          result.bedrooms >= parseInt(filters.bedrooms)
        );
      }

      // Sort results
      switch (filters.sortBy) {
        case 'price-low':
          filteredResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredResults.sort((a, b) => b.price - a.price);
          break;
        case 'sqft-large':
          filteredResults.sort((a, b) => b.sqft - a.sqft);
          break;
        case 'newest':
        default:
          filteredResults.sort((a, b) => new Date(b.listDate).getTime() - new Date(a.listDate).getTime());
          break;
      }

      setResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const saveSearch = () => {
    if (!filters.query.trim()) return;
    
    const searchName = filters.query.trim();
    if (!savedSearches.includes(searchName)) {
      const updated = [...savedSearches, searchName];
      setSavedSearches(updated);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    }
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'sortBy' && value !== '' && value !== defaultFilters[key as keyof SearchFilters]
  );

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-1 flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input
              ref={inputRef}
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowResults(true)}
              placeholder="Search properties, neighborhoods, or MLS numbers..."
              className="w-full px-3 py-3 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center space-x-1 px-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Advanced Filters"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Neighborhood */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Neighborhood
                </label>
                <select
                  value={filters.neighborhood}
                  onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Neighborhoods</option>
                  {neighborhoods.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Square Footage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Square Footage</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.sqftMin}
                    onChange={(e) => handleFilterChange('sqftMin', e.target.value)}
                    placeholder="Min Sq Ft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.sqftMax}
                    onChange={(e) => handleFilterChange('sqftMax', e.target.value)}
                    placeholder="Max Sq Ft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Year Built */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year Built
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.yearBuiltMin}
                    onChange={(e) => handleFilterChange('yearBuiltMin', e.target.value)}
                    placeholder="From"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.yearBuiltMax}
                    onChange={(e) => handleFilterChange('yearBuiltMax', e.target.value)}
                    placeholder="To"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="sqft-large">Largest First</option>
                </select>
              </div>

              {/* Listing Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Listing Type</label>
                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Listings</option>
                  <option value="for-sale">For Sale</option>
                  <option value="sold">Recently Sold</option>
                  <option value="off-market">Off Market</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={saveSearch}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Save Search
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Searching properties...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((result) => (
                <div key={result.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{result.address}</h4>
                      <p className="text-sm text-gray-600">{result.neighborhood}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-green-600">
                          ${result.price.toLocaleString()}
                        </span>
                        <span>{result.bedrooms} bed</span>
                        <span>{result.bathrooms} bath</span>
                        <span>{result.sqft.toLocaleString()} sq ft</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {result.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Listed {new Date(result.listDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No properties found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}