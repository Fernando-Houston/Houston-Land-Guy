# 📋 Terminal 2 - Sellers Page API & Data Tasks

## 🎯 Your Mission
Create APIs and populate real data for the 5 broken seller tools. T1 is creating the pages, you create the backend.

## 🚨 IMMEDIATE PRIORITY - Create These APIs

### 1. Property Valuation API
**File**: `app/api/sellers/valuation/route.ts`

```typescript
// POST request with property address
// Return structure:
{
  estimatedValue: number,
  confidence: number, // 0-100
  comparables: Array<{
    address: string,
    soldPrice: number,
    soldDate: string,
    sqft: number,
    beds: number,
    baths: number,
    distance: number
  }>,
  priceHistory: Array<{
    date: string,
    price: number
  }>,
  marketTrends: {
    avgPricePerSqft: number,
    appreciationRate: number,
    daysOnMarket: number
  }
}
```

### 2. Market Timing API
**File**: `app/api/sellers/market-timing/route.ts`

```typescript
// GET request with optional zipCode
// Return structure:
{
  currentTrend: 'rising' | 'stable' | 'declining',
  bestMonthsToSell: string[],
  worstMonthsToSell: string[],
  priceProjection: {
    '30days': number,
    '60days': number,
    '90days': number
  },
  seasonalData: Array<{
    month: string,
    avgSalePrice: number,
    avgDaysOnMarket: number,
    salesVolume: number
  }>,
  recommendation: string
}
```

### 3. Buyer Demand API
**File**: `app/api/sellers/demand/route.ts`

```typescript
// GET request
// Return heat map data:
{
  demandZones: Array<{
    zipCode: string,
    neighborhood: string,
    demandScore: number, // 0-100
    avgSearchPrice: number,
    activeSearches: number,
    coordinates: { lat: number, lng: number }
  }>,
  topSearchCriteria: {
    priceRanges: Array<{ min: number, max: number, count: number }>,
    bedrooms: Array<{ beds: number, count: number }>,
    features: Array<{ feature: string, count: number }>
  }
}
```

## 📊 Data Import Scripts

### 1. Import Comparable Sales Data
**File**: `scripts/import-comparable-sales.ts`
- Import recent sales from MLS
- Calculate price per sqft
- Store in database with geolocation

### 2. Import Market Timing Data
**File**: `scripts/import-market-timing.ts`
- Analyze historical sales by month
- Calculate seasonal patterns
- Generate prediction models

### 3. Create Buyer Demand Tracking
**File**: `scripts/track-buyer-demand.ts`
- Simulate buyer search patterns
- Generate heat map data
- Track popular features

## 🔄 Database Schema Updates

Add these tables/collections:

```sql
-- Comparable Sales
CREATE TABLE comparable_sales (
  id SERIAL PRIMARY KEY,
  address TEXT,
  sold_price DECIMAL,
  sold_date DATE,
  sqft INTEGER,
  beds INTEGER,
  baths DECIMAL,
  lat DECIMAL,
  lng DECIMAL,
  neighborhood_id INTEGER
);

-- Market Timing Data
CREATE TABLE market_timing (
  id SERIAL PRIMARY KEY,
  zip_code VARCHAR(10),
  month INTEGER,
  year INTEGER,
  avg_sale_price DECIMAL,
  avg_days_on_market INTEGER,
  sales_volume INTEGER
);

-- Buyer Demand Tracking
CREATE TABLE buyer_demand (
  id SERIAL PRIMARY KEY,
  zip_code VARCHAR(10),
  search_date DATE,
  price_min DECIMAL,
  price_max DECIMAL,
  beds INTEGER,
  features JSONB
);
```

## ⚡ Quick Implementation Guide

1. **Start with Mock Data** - Get APIs working first
2. **Import Real Data** - Use our existing property database
3. **Add Calculations** - Implement valuation algorithms
4. **Test with T1** - Ensure pages can consume APIs

## 📝 Progress Checklist

- [ ] Create valuation API endpoint
- [ ] Create market timing API endpoint
- [ ] Create buyer demand API endpoint
- [ ] Import comparable sales data
- [ ] Import historical market data
- [ ] Create demand tracking system
- [ ] Test all APIs with Postman
- [ ] Document API usage for T1

## 🎯 Success Criteria

- All APIs return real data (not mocks)
- Response time < 500ms
- Valuation accuracy within 5%
- Heat map shows actual demand patterns

## 💬 Coordination

- Update progress in TERMINAL_SYNC_STATUS.md every 30 mins
- Tag completed tasks with timestamp
- Alert T1 when APIs are ready
- Alert T3 when data imports are needed