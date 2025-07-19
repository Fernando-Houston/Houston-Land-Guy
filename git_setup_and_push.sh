#!/bin/bash

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add remote if not already added
if ! git remote | grep -q "origin"; then
    echo "Adding remote repository..."
    git remote add origin https://github.com/Fernando-Houston/Houston-Land-Guy.git
fi

# Add all files
echo "Adding all files..."
git add .

# Create commit
echo "Creating commit..."
git commit -m "Add 6 major AI-powered features to Houston Development Intelligence

- AI Property Recommendations: Personalized property suggestions with scoring algorithm
- Advanced Search with AI: Natural language search understanding and smart suggestions  
- Mobile PWA: Progressive Web App with offline support and install prompt
- Predictive Analytics: Property value predictions, market forecasting, investment scenarios
- Social Features: Community hub with posts, market insights, professional groups
- Document Analysis: AI-powered document intelligence with risk/opportunity extraction

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to main branch
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Changes have been pushed to https://github.com/Fernando-Houston/Houston-Land-Guy"