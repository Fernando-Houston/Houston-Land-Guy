# Environment Variables for Vercel

Add these environment variables to your Vercel project settings:

## Database (Railway PostgreSQL)
```
DATABASE_URL=postgresql://postgres:sjAcwCutjRXMHTqckVaavhAmCWVCCIOw@shortline.proxy.rlwy.net:44419/railway
```

## API Keys
```
PERPLEXITY_API_KEY=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
CENSUS_API_KEY=cda0d6f4c3bb30fe797126c5b51157e9776eafe6
REPLICATE_API_TOKEN=your-replicate-api-token-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyA0peD_GfXj6GW2BDw70bBUIj23K5SAvYw
```

## NextAuth
```
NEXTAUTH_SECRET=your-random-secret-key-here-x7k9m2p5q8w3n6
NEXTAUTH_URL=https://houston-development-intelligence.vercel.app
```

## Houston Data Sources
```
HOUSTON_OPENDATA_BASE_URL=https://data.houstontx.gov
HCAD_BASE_URL=https://pdata.hcad.org
```

## Email (Optional for now)
```
RESEND_API_KEY=placeholder
RESEND_FROM_EMAIL=noreply@houstonlandguy.com
```

## Feature Flags
```
USE_REPLICATE=false
```

## Redis (Optional - for caching)
```
REDIS_URL=redis://localhost:6379
```

Note: Do NOT add Core Agents variables as we're using Fernando-X instead.