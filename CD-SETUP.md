# Continuous Deployment Setup Guide

## Overview

This project now includes a complete Continuous Deployment (CD) pipeline that automatically deploys your application when tests pass.

## 🚀 CI/CD Pipeline Structure

```
Push to main branch
    ↓
Frontend CI (Unit Tests + Build)
    ↓
Backend CI (Unit Tests + Coverage)  
    ↓
Performance Tests (Bundle Size Check)
    ↓
Deploy to Production (Vercel + Render)
```

## 📋 Required Repository Secrets

To enable automatic deployment, configure these secrets in your GitHub repository:

### Go to: `Settings` → `Secrets and variables` → `Actions`

#### For Vercel Deployment (Frontend):
- **VERCEL_TOKEN**: Your Vercel deployment token
  - Get it from: https://vercel.com/account/tokens
- **VERCEL_ORG_ID**: Your Vercel organization/team ID
  - Get it from: https://vercel.com/[username]/settings
- **VERCEL_PROJECT_ID**: Your Vercel project ID
  - Get it from your project settings in Vercel dashboard

#### For Render Deployment (Backend):
- **RENDER_DEPLOY_HOOK**: Webhook URL for Render deployment
  - Get it from: Render Dashboard → Your Service → Settings → Deploy Hook

## 🔧 How to Get Vercel Secrets

1. **VERCEL_TOKEN**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to get token
   vercel login
   vercel --token # This will show your token
   ```

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to Settings → General
   - Copy the Project ID and Team ID

## 🔧 How to Get Render Deploy Hook

1. Go to your Render dashboard
2. Select your backend service
3. Go to Settings tab
4. Scroll to "Deploy Hook" section
5. Click "Create Deploy Hook"
6. Copy the webhook URL

## 🚦 Pipeline Behavior

### ✅ When Tests Pass:
- Frontend and Backend CI runs
- Performance tests execute
- Application deploys automatically to production
- Deployment notifications sent

### ❌ When Tests Fail:
- Pipeline stops at failed step
- No deployment occurs
- Detailed error logs available in Actions tab

## 🔍 Monitoring Deployments

1. **GitHub Actions**: Check the Actions tab for pipeline status
2. **Vercel**: Monitor frontend deployment at https://vercel.com/dashboard
3. **Render**: Monitor backend deployment at https://render.com/dashboard

## 📱 Manual Deployment Trigger

You can manually trigger deployments:

1. Go to Actions tab in GitHub
2. Select "Continuous Deployment" workflow
3. Click "Run workflow"
4. Choose the branch (usually `main`)

## 🐛 Troubleshooting

### Common Issues:

1. **Secrets Not Configured**:
   - Pipeline will show warnings but continue
   - Deployments will be skipped
   - Add the required secrets to fix

2. **Vercel Deployment Fails**:
   - Check if project is linked correctly
   - Verify token permissions
   - Ensure project ID is correct

3. **Render Deployment Fails**:
   - Verify webhook URL is correct
   - Check Render service status
   - Ensure service is configured for auto-deploy

4. **Tests Fail**:
   - Check test logs in Actions tab
   - Fix failing tests before deployment
   - Pipeline will not deploy if tests fail

## 📊 Performance Testing

The pipeline includes:
- Bundle size analysis
- Build optimization checks
- Performance metrics collection

## 🔄 Rollback Strategy

If deployment issues occur:
1. Fix the issue in your code
2. Push to main branch
3. Pipeline will automatically deploy the fix
4. Monitor deployment status

## ✨ Benefits

- **Automated Quality Gates**: Only deploys when all tests pass
- **Performance Monitoring**: Catches performance regressions
- **Zero-Downtime Deployments**: Vercel and Render handle this automatically
- **Audit Trail**: Complete deployment history in GitHub Actions
- **Fast Feedback**: Quick notification of issues

---

## 🐛 Fixed Issues

### Course Creation Bug
- **Issue**: Course creation failed with "título required" error
- **Root Cause**: Frontend sent `name` field but backend expected `title`
- **Fix**: Updated frontend to use `title` field consistently
- **Status**: ✅ Fixed

The course creation form now correctly validates and submits course data.
