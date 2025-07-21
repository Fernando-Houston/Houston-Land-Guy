# Data Refresh Automation System

## Overview

The Houston Development Intelligence platform now includes a comprehensive data refresh automation system that:

1. **Fetches data from Perplexity API** - Leverages your Perplexity Max plan for market research
2. **Tracks market trends** - Detects significant changes in real estate metrics
3. **Sends alerts** - Notifies about important market movements
4. **Runs scheduled updates** - Automated daily/weekly/monthly refreshes
5. **Provides API endpoints** - Manual triggers and webhook integrations

## Components

### 1. Refresh Manager (`lib/services/data-refresh/refresh-manager.ts`)
- Orchestrates all data refresh operations
- Supports 6 data sources:
  - Perplexity market trends
  - Perplexity development news
  - Perplexity economic data
  - CSV data imports
  - Rental market updates
  - Construction permits

### 2. Perplexity Fetcher (`lib/services/data-refresh/perplexity-fetcher.ts`)
- Integrates with Perplexity API for research data
- Extracts structured data from natural language responses
- Supports market data, development news, and economic indicators

### 3. Market Trend Tracker (`lib/services/data-refresh/market-trend-tracker.ts`)
- Monitors changes in:
  - Home prices (2%, 5%, 10% thresholds)
  - Inventory levels (5%, 10%, 20% thresholds)
  - Days on market (3, 7, 14 days thresholds)
  - Rental rates (2%, 5%, 8% thresholds)
  - Permit counts (10%, 25%, 50% thresholds)

### 4. Alert Service (`lib/services/data-refresh/alert-service.ts`)
- Multi-channel alerts:
  - Console (always enabled)
  - Email (requires configuration)
  - Webhook (HTTP POST)
  - Slack (requires integration)
- Configurable significance levels

### 5. Cron Manager (`lib/services/data-refresh/cron-manager.ts`)
- Scheduled jobs:
  - Daily market trends (6 AM CST)
  - Weekly deep refresh (2 AM Sunday)
  - Hourly permit checks (disabled by default)

## API Endpoints

### `/api/data-refresh`

**GET** - Get refresh status
```json
{
  "cronJobs": [{"name": "daily_market_trends", "running": true}],
  "lastRefresh": "2025-01-21T12:00:00Z",
  "nextScheduled": "2025-01-22T06:00:00Z"
}
```

**POST** - Trigger refresh actions
```json
// Refresh all data
{
  "action": "refresh_all",
  "force": true
}

// Refresh specific source
{
  "action": "refresh_source",
  "source": "perplexity_market_trends"
}

// Start/stop cron jobs
{
  "action": "start_cron" | "stop_cron"
}
```

### `/api/data-refresh/webhook`

**POST** - Receive external updates
```json
// Perplexity update
{
  "type": "perplexity_update",
  "data": {
    "source": "market_research",
    "timestamp": "2025-01-21T12:00:00Z"
  }
}

// Market alert
{
  "type": "market_alert",
  "data": {
    "metric": "Houston Median Price",
    "value": 375000,
    "change": 8.5,
    "description": "Significant price increase detected"
  }
}
```

## Configuration

### Environment Variables
```env
# Perplexity API (uses existing PERPLEXITY_API_KEY)
PERPLEXITY_API_KEY=your_key_here

# Webhook security
WEBHOOK_SECRET=your_secret_here

# Alert channels (optional)
ALERT_EMAIL=admin@example.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### Alert Configuration
```typescript
alertService.updateConfig({
  email: 'admin@example.com',
  webhook: 'https://your-app.com/webhook',
  slackChannel: '#market-alerts',
  minSignificance: 'medium', // low, medium, high
  categories: ['all'] // or specific categories
})
```

## Testing

Run the test script to verify the system:
```bash
npm install  # Install node-cron dependency
tsx scripts/test-data-refresh.ts
```

## Usage Examples

### Manual Refresh
```typescript
// Refresh all data sources
const results = await dataRefreshManager.refreshAllData()

// Force refresh (ignores schedule)
const results = await dataRefreshManager.refreshAllData(true)
```

### Detect Market Changes
```typescript
const changes = await marketTrendTracker.detectSignificantChanges()
// Returns array of MarketChange objects with significance levels
```

### Send Custom Alert
```typescript
await alertService.sendAlerts([{
  metric: 'Custom Metric',
  previousValue: 100,
  currentValue: 150,
  changePercent: 50,
  significance: 'high',
  description: 'Custom alert description',
  timestamp: new Date()
}])
```

## Data Sources

### 1. Perplexity Market Trends
- Houston real estate market trends
- Housing inventory and days on market
- Median home prices by neighborhood
- Rental market rates
- Construction permits

### 2. Perplexity Development News
- Major development projects
- Commercial real estate developments
- Residential developments
- Infrastructure projects

### 3. Perplexity Economic Data
- Unemployment rate
- Job growth by sector
- GDP growth rate
- Population growth
- Median household income

### 4. CSV Imports (Data Process 5)
- Demographics data
- Rental market analysis
- Employer information
- STR market data
- Income statistics

## Next Steps

1. **Configure Perplexity API Key** - Add your API key to environment variables
2. **Set Up Alert Channels** - Configure email, Slack, or webhook endpoints
3. **Enable Cron Jobs** - Start automated refreshes in production
4. **Monitor Dashboard** - Build UI to visualize refresh status and trends
5. **Connect Real APIs** - Integrate with MLS, permit databases, etc.

## Architecture Benefits

- **Scalable** - Add new data sources easily
- **Reliable** - Error handling and retry logic
- **Observable** - Detailed logging and metrics
- **Flexible** - Manual and automated refresh options
- **Intelligent** - Detects and alerts on significant changes