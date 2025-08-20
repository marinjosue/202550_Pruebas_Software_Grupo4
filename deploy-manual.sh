#!/bin/bash

echo "🚀 Manual Deployment Script"
echo "========================="
echo ""

# Frontend Build
echo "📦 Building Frontend..."
cd holistica-frontend
npm ci
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Manual Vercel deployment
echo ""
echo "🌐 Deploy to Vercel manually:"
echo "1. Run: npx vercel --prod"
echo "2. Follow the prompts"
echo ""

# Check if we have Vercel token
if [ -n "$VERCEL_TOKEN" ]; then
    echo "🔧 Attempting automatic Vercel deployment..."
    
    # Clean any existing config
    rm -rf .vercel
    
    # Setup project
    mkdir -p .vercel
    echo '{"orgId":"team_TS8BZ3MlloyA2QCGIsLsnXfI","projectId":"prj_0WhB22TOtUlpoZKmDiDw7lMu9dY5"}' > .vercel/project.json
    
    # Deploy
    npx vercel build --prod --token="$VERCEL_TOKEN"
    npx vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
else
    echo "💡 For automatic deployment, set VERCEL_TOKEN environment variable"
    echo "   export VERCEL_TOKEN=your_token_here"
fi

cd ..

# Backend info
echo ""
echo "🖥️ Backend deployment:"
echo "• Render will auto-deploy from GitHub pushes"
echo "• Or use webhook: curl -X POST \$RENDER_DEPLOY_HOOK"

echo ""
echo "✅ Deployment script completed!"
