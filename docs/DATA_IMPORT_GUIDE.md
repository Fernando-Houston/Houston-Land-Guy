# Data Import Guide

## Overview
The Houston Development Intelligence platform now has a complete data infrastructure for storing and querying real estate data instead of relying on hardcoded values.

## Database Schema

### Core Tables:
- **Property** - MLS listings with full details (address, price, features, etc.)
- **Developer** - Development companies and builders
- **Project** - Major development projects
- **Permit** - Building permits
- **MarketMetrics** - Area statistics and trends
- **PriceHistory** - Property price changes over time
- **MarketAnalysis** - Property valuations and analysis

## Running Database Migrations

First, generate the Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Create/update database schema
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name add_real_estate_schema
```

## Importing Initial Data

### Method 1: Using the Script (Recommended)

```bash
# Import all data types at once
npx tsx scripts/import-initial-data.ts
```

This will import:
- 10 major developers (D.R. Horton, Lennar, etc.)
- 7 major projects (East River 9, TMC3, etc.)
- Market metrics for top growth areas
- 50 sample properties

### Method 2: Using the Admin API

```bash
# Import specific data type
curl -X POST http://localhost:3000/api/admin/data-import \
  -H "Content-Type: application/json" \
  -d '{"importType": "developers"}'

# Import all data
curl -X POST http://localhost:3000/api/admin/data-import \
  -H "Content-Type: application/json" \
  -d '{"importType": "all"}'

# Check import status
curl http://localhost:3000/api/admin/data-import?importId=YOUR_IMPORT_ID
```

**Note:** Admin authentication is required for API endpoints.

### Method 3: From CSV Files

```typescript
import { dataImportService } from '@/lib/services/data-import-service'

// Import properties from CSV
await dataImportService.importFromCSV('/path/to/properties.csv', 'properties')

// Import permits from CSV
await dataImportService.importFromCSV('/path/to/permits.csv', 'permits')
```

## CSV Format Examples

### Properties CSV:
```csv
mls_number,address,city,state,zip_code,neighborhood,property_type,status,list_price,square_feet,bedrooms,bathrooms,year_built,lot_size,features
HAR123456,"123 Main St",Houston,TX,77001,Downtown,residential,active,450000,2500,3,2.5,2020,0.25,"Pool,Updated Kitchen,Garage"
```

### Permits CSV:
```csv
permit_number,address,zip_code,permit_type,work_type,description,declared_value,status,application_date,issue_date,owner_name,contractor_name
H2024-001234,"456 Oak St",77002,building,"new construction","Single family home",350000,issued,2024-01-15,2024-02-01,"John Smith","ABC Builders"
```

## Fernando-X Integration

Fernando-X now queries the real database automatically. Examples:

- "What are the fastest growing areas?" - Queries MarketMetrics table
- "Tell me about D.R. Horton" - Queries Developer and Project tables
- "Show me properties in Katy" - Queries Property table
- "What's the permit activity?" - Queries Permit table

The system falls back to hardcoded data if database queries fail.

## Database Statistics

Check current data counts:

```typescript
import { fernandoDataQuery } from '@/lib/fernando-x/data-query-service'

const stats = await fernandoDataQuery.getDatabaseStats()
console.log(stats)
// Output:
// {
//   tables: {
//     properties: 50,
//     developers: 10,
//     projects: 7,
//     permits: 0,
//     marketMetrics: 15
//   },
//   totalRecords: 82,
//   estimatedDataPoints: 1650
// }
```

## Next Steps

1. **Connect Real Data Sources:**
   - MLS API integration
   - City permit database
   - County tax records
   - Market statistics providers

2. **Set Up Data Refresh:**
   - Daily MLS updates
   - Weekly permit pulls
   - Monthly market statistics

3. **Data Quality:**
   - Deduplication
   - Address standardization
   - Data validation

4. **Performance:**
   - Add database indexes
   - Implement caching
   - Query optimization

## Troubleshooting

**Import fails with "Unknown Developer"**
- The system creates a generic developer if none is found
- Update the developer mapping in the import service

**Fernando-X shows old data**
- Check if database connection is working
- Verify data was imported successfully
- Check console for fallback messages

**Slow queries**
- Add indexes to frequently queried fields
- Implement query result caching
- Consider database connection pooling