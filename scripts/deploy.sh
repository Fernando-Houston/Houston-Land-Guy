#!/bin/bash

echo "🚀 Starting Houston Development Intelligence deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Seed database (only in development)
if [ "$NODE_ENV" != "production" ]; then
  echo "🌱 Seeding database..."
  npm run db:seed
fi

echo "✅ Deployment preparation complete!"