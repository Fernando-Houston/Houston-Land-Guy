# Add OpenAI API Key to Vercel

You need to add the OpenAI API key to your Vercel environment variables:

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Click on "Environment Variables"
4. Add a new environment variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `[YOUR_OPENAI_API_KEY]` (you provided this in the chat)
   - **Environment**: Select all (Production, Preview, Development)

5. Click "Save"

The ChatGPT integration will automatically activate once this environment variable is set.