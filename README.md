# Houston Development Intelligence

A data-driven lead generation platform for small-to-medium builders in Houston, built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL.

## Project Setup Complete ✅

### What's Been Implemented

1. **Next.js 14 Project Foundation**
   - TypeScript configuration
   - Tailwind CSS styling
   - App Router structure
   - ESLint configuration

2. **Database Setup (Prisma + PostgreSQL)**
   - Lead management schema
   - Interaction tracking
   - Calculator results storage
   - Market data caching

3. **Branding & Layout**
   - 70% Houston Development Intelligence / 30% Houston Land Guy branding
   - Responsive header with mobile menu
   - Comprehensive footer with navigation
   - Mobile-first design approach

4. **Homepage with Lead Capture**
   - Hero section with clear value proposition
   - Lead capture form integrated
   - Features showcase
   - Call-to-action sections

5. **Navigation Structure**
   - /tools - Development calculators
   - /intelligence - Market data and insights
   - /services - Service offerings
   - /about - Company information
   - /contact - Contact forms
   - /consultation - Consultation booking

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Railway recommended)

### Environment Setup

Create a `.env.local` file and update with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Core Agents Integration
CORE_AGENTS_URL=https://core-agents-6d4f5.up.railway.app
CORE_AGENTS_SECRET_KEY=your_secret_key_here

# External APIs
PERPLEXITY_API_KEY=your_perplexity_key_here
CENSUS_API_KEY=your_census_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
```

### Installation & Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema (after configuring DATABASE_URL)
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
houston-development-intelligence/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Marketing pages route group
│   ├── (tools)/            # Tools route group
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout with header/footer
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── tools/              # Tool-specific components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/
│   ├── db/                 # Database utilities
│   ├── api/                # API helpers
│   ├── utils/              # Shared utilities
│   ├── types/              # TypeScript types
│   ├── validations/        # Zod schemas
│   └── errors/             # Error handling
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## Key Features

- **Lead Capture**: Forms throughout the site capture leads with source tracking
- **Database Ready**: PostgreSQL with Prisma ORM configured
- **Mobile-First**: Fully responsive design
- **SEO Optimized**: Meta tags and structured data ready
- **Type-Safe**: Full TypeScript implementation
- **API Routes**: RESTful API for lead management

## Next Steps for Development

1. **Connect Railway PostgreSQL**
   - Update DATABASE_URL in .env.local
   - Run `npx prisma db push`

2. **Implement ROI Calculator** (Terminal 2)
   - Create calculator UI components
   - Add calculation logic
   - Integrate with lead capture

3. **Core Agents Integration** (Terminal 3)
   - Implement API client
   - Add market data fetching
   - Create data visualization components

4. **Content & SEO** (Terminal 4)
   - Add meta tags
   - Create content pages
   - Implement analytics

## Commands

```bash
# Development
npm run dev         # Start development server with Turbopack
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint

# Database
npx prisma studio   # Open Prisma Studio
npx prisma generate # Generate Prisma client
npx prisma db push  # Push schema to database
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Railway)
- **ORM**: Prisma
- **State Management**: Zustand (installed)
- **Forms**: React Hook Form (ready to install)
- **Validation**: Zod
- **Icons**: Lucide React

---

Built for Houston Development Intelligence by Terminal 1
