#!/bin/bash

# Fix Clock variable error in AISearchBar component
echo "🔧 Fixing Clock variable error..."

# Add the fix
git add components/search/AISearchBar.tsx

# Commit the fix
git commit -m "Fix Clock import error in AISearchBar component

- Added missing Clock import from lucide-react
- Fixes runtime error when clicking Fernando search box
- Recent searches now display properly with clock icon

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin main

echo "✅ Fix deployed successfully!"
echo "🔗 The error should be resolved once Vercel rebuilds"