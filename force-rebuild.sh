#!/bin/bash

# Force complete rebuild on Vercel
echo "🔄 Forcing complete rebuild..."

# Step 1: Add a timestamp to force new commit
echo "// Force rebuild: $(date)" >> lib/fernando-x.ts

# Step 2: Commit all changes
git add -A
git commit -m "Force complete rebuild with enhanced Fernando-X

- Added diagnostic logging
- 750,000+ data points integrated
- Clear version indicators (🚀)
- Force cache invalidation: $(date)

IMPORTANT: After deploy, clear browser cache and test in incognito

Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 3: Push to trigger new build
git push origin main

echo "✅ Pushed! Now do the following:"
echo ""
echo "1. Go to Vercel Dashboard"
echo "2. Find the new deployment"
echo "3. Click on it and check the build logs"
echo "4. Look for any errors during build"
echo "5. Once deployed, test in incognito mode"
echo ""
echo "If still not working:"
echo "- Check Vercel environment variables"
echo "- Look for build cache settings"
echo "- Try 'Redeploy' with 'Use existing Build Cache' UNCHECKED"