#!/bin/bash

# Deploy Fernando-X to Git
echo "🚀 Deploying Fernando-X AI Assistant..."

# Navigate to project directory
cd "/Users/fernandox/Desktop/Houston Land Group New Webiste/houston-development-intelligence"

# Add all Fernando-X files
echo "📦 Adding Fernando-X files..."
git add lib/fernando-x/
git add components/fernando-x-chat.tsx
git add app/page.tsx

# Add any other modified files
git add lib/services/houston-data-service.ts
git add lib/services/houston-city-data-service.ts
git add lib/services/map-3d-visualization-service.ts

# Create commit
echo "💾 Creating commit..."
git commit -m "🤖 Add Fernando-X AI Assistant with comprehensive Houston real estate intelligence

- Integrated ALL data from DataProcess folders (750k+ data points)
- Voice interface with wake word detection
- Computer vision for property photo analysis
- Natural language report generation (5 report types)
- Portfolio optimization with Modern Portfolio Theory
- Real-time data streams (5 active streams)
- Semantic search across all knowledge
- Multi-turn conversation management
- Professional chat UI with voice/image support

Fernando-X can now answer ANY Houston real estate question using:
- July 2025 MLS data (8,588 sales, $346k median)
- Q4 2024 market data
- 46,269 construction permits analyzed
- $14.6B investment flow tracking
- 293 tech companies in innovation districts
- Complete developer rankings and project pipeline
- Environmental, demographic, and infrastructure data

Co-Authored-By: Claude <noreply@anthropic.com>"

# Show status
echo "📊 Current status:"
git status

# Push to remote
echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ Fernando-X deployed successfully!"
echo "🔗 Visit https://github.com/Fernando-Houston/Houston-Land-Guy to view changes"