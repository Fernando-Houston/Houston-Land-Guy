# Environment Variables Setup

## Important Security Notice
**NEVER commit your actual API keys to git!** The `.gitignore` file is configured to exclude all `.env` files.

## Setup Instructions

1. Create a `.env.local` file in the root directory
2. Copy the template below and add your API keys
3. Never share or commit this file

## Required API Keys

### Maps & Visualization
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### AI Services
```
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### Data Sources
```
CENSUS_API_KEY=your_census_api_key_here
```

### Houston Open Data (Public - No Keys Needed)
```
HOUSTON_DATA_PORTAL_URL=https://data.houstontx.gov/resource
HOUSTON_PERMITS_ENDPOINT=76tv-r7km.json
HOUSTON_CRIME_ENDPOINT=9e3t-zr3j.json
HOUSTON_311_ENDPOINT=ene4-h3k2.json
```

### Authentication
```
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

### Optional Services
```
# Email (SendGrid)
SENDGRID_API_KEY=

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Financial (Plaid)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_PUBLIC_KEY=
```

## Where to Get API Keys

1. **Mapbox**: https://account.mapbox.com/auth/signup/
2. **Google Maps**: https://console.cloud.google.com/google/maps-apis/
3. **OpenAI**: https://platform.openai.com/api-keys
4. **Perplexity**: https://www.perplexity.ai/settings/api
5. **Census**: https://api.census.gov/data/key_signup.html
6. **SendGrid**: https://signup.sendgrid.com/
7. **Twilio**: https://www.twilio.com/try-twilio
8. **Plaid**: https://dashboard.plaid.com/signup

## Security Best Practices

1. Use different API keys for development and production
2. Rotate keys regularly
3. Set up API key restrictions (domain, IP, etc.)
4. Monitor API usage for unusual activity
5. Never expose keys in client-side code (except those prefixed with `NEXT_PUBLIC_`)

## Verifying Your Setup

Run this command to check if your environment is configured:
```bash
npm run dev
```

If you see errors about missing API keys, check your `.env.local` file.