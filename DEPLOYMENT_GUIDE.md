# Deployment Guide - Houston Development Intelligence

## Important: Protecting Your Vercel Deployment

### Current Setup
- **Production URL**: https://houston-development-intelligence.vercel.app
- **GitHub Repo**: https://github.com/Fernando-Houston/Houston-Land-Guy
- **Vercel Project**: houston-development-intelligence

### To Prevent Accidental Overwrites

1. **Vercel Team Settings**
   - Go to Vercel Dashboard → Settings → Team Members
   - Review who has access to deploy
   - Consider using different Vercel projects for different applications

2. **Set Up Deployment Protection**
   ```
   vercel env add DEPLOYMENT_PASSWORD
   ```
   Then add to vercel.json:
   ```json
   {
     "functions": {
       "api/deploy-check.js": {
         "includeFiles": "api/deploy-check.js"
       }
     }
   }
   ```

3. **Use Branch Protection**
   - Deploy only from `main` branch
   - Require pull requests for changes
   - Set up GitHub branch protection rules

4. **Deployment Commands**
   ```bash
   # Always verify you're in the correct directory
   pwd
   
   # Check git remote
   git remote -v
   
   # Deploy to production
   vercel --prod
   
   # Deploy to preview
   vercel
   ```

### Emergency Recovery

If someone overwrites your deployment:

1. **Force redeploy from correct directory**
   ```bash
   cd /path/to/houston-development-intelligence
   vercel --prod --force
   ```

2. **Check deployment history**
   ```bash
   vercel ls
   ```

3. **Rollback if needed**
   ```bash
   vercel rollback [deployment-url]
   ```

### Best Practices

1. **Separate Projects**: Each application should have its own Vercel project
2. **Access Control**: Limit who can deploy to production
3. **Environment Variables**: Keep them secure and documented
4. **Regular Backups**: Keep your code in GitHub up to date

### Team Communication

Before deploying:
- Announce in team chat
- Verify project name in Vercel
- Double-check directory location
- Confirm GitHub repository

### Contact for Issues
If deployment issues occur, contact the project lead immediately.