# Deployment Guide - d3imos.com

## Overview

This guide covers the complete deployment process for d3imos.com, a Next.js application deployed on Vercel with MongoDB Atlas.

## Architecture

```
┌─────────────────┐      HTTPS        ┌──────────────────┐
│   Users/Clients │ ◄────────────────► │  Vercel (Edge)   │
└─────────────────┘                    │  - Next.js App   │
                                       │  - Middleware    │
                                       │  - API Routes    │
                                       └────────┬─────────┘
                                                │
                                                │ Encrypted
                                                │ Connection
                                                │
                                       ┌────────▼─────────┐
                                       │  MongoDB Atlas   │
                                       │  - d3imos_auth   │
                                       │  - audit_logs    │
                                       └──────────────────┘
```

## Prerequisites

Before deploying, ensure you have:

- [x] Vercel account connected to GitHub repository
- [x] MongoDB Atlas cluster (M0 free tier or higher)
- [x] Google OAuth 2.0 credentials configured
- [x] All environment variables documented
- [x] Git repository with latest code

## Environment Variables

### Required Variables

All deployments require these environment variables:

| Variable | Purpose | Example | Security Level |
|----------|---------|---------|----------------|
| `MONGODB_URI` | Database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=D3IMOS` | **CRITICAL** |
| `NEXTAUTH_SECRET` | JWT signing secret | `base64-encoded-random-string` | **CRITICAL** |
| `NEXTAUTH_URL` | Application URL | `https://d3imos.com` | Public |
| `GOOGLE_CLIENT_ID` | OAuth client ID | `328760200817-xxx.apps.googleusercontent.com` | **CRITICAL** |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | `GOCSPX-xxx` | **CRITICAL** |
| `ENCRYPTION_KEY` | AES-256 encryption key | `256-bit hex string` | **CRITICAL** |

### How to Generate Secrets

```bash
# Generate NEXTAUTH_SECRET (recommended method)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (256-bit for AES-256)
openssl rand -hex 32
```

### Setting Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (d3imos.com)
3. Settings → Environment Variables
4. Add each variable:
   ```bash
   vercel env add MONGODB_URI production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   vercel env add GOOGLE_CLIENT_ID production
   vercel env add GOOGLE_CLIENT_SECRET production
   vercel env add ENCRYPTION_KEY production
   ```

## Deployment Workflow

### Standard Deployment (Automatic)

Every push to `main` branch triggers automatic deployment:

```bash
# 1. Make your changes locally
git add .
git commit -m "feat: add new feature"

# 2. Push to GitHub
git push origin main

# 3. Vercel automatically:
#    - Detects push
#    - Runs build: `pnpm build`
#    - Runs type check
#    - Deploys to production
#    - Assigns production URL (d3imos.com)
```

**Build Process:**
```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Vercel Build        │
│  1. npm install      │
│  2. next build       │
│  3. Optimize assets  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Health Checks       │
│  - Build succeeded?  │
│  - No type errors?   │
│  - Env vars set?     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Deploy to Edge      │
│  - Zero downtime     │
│  - Atomic deployment │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  DNS Update          │
│  d3imos.com → new    │
│  deployment          │
└──────────────────────┘
```

### Manual Deployment (CLI)

For testing or hotfixes:

```bash
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs d3imos.com
```

## Pre-Deployment Checklist

Before pushing to production, verify:

### 1. Code Quality
```bash
# Run type check
pnpm type-check

# Run linter
pnpm lint

# Run tests (if you have them)
pnpm test
```

### 2. Environment Variables
```bash
# Verify all required env vars are set in Vercel
vercel env ls
```

Should show:
- ✅ MONGODB_URI (Production)
- ✅ NEXTAUTH_SECRET (Production)
- ✅ NEXTAUTH_URL (Production)
- ✅ GOOGLE_CLIENT_ID (Production)
- ✅ GOOGLE_CLIENT_SECRET (Production)
- ✅ ENCRYPTION_KEY (Production)

### 3. Security Headers
Verify `next.config.js` includes:
- ✅ Content-Security-Policy
- ✅ Strict-Transport-Security
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff

### 4. Database
- ✅ MongoDB Atlas cluster is running
- ✅ Database user has correct permissions
- ✅ IP whitelist includes `0.0.0.0/0` (for Vercel)
- ✅ Indexes are created (automatic on first deploy)

### 5. OAuth Configuration
- ✅ Google OAuth authorized redirect URIs include:
  - `https://d3imos.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for development)

## Post-Deployment Verification

After deployment completes:

### 1. Health Check
```bash
# Visit your production URL
curl -I https://d3imos.com

# Should return:
# HTTP/2 200
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# x-frame-options: DENY
# x-content-type-options: nosniff
```

### 2. Functional Tests

Test critical user flows:

1. **Registration Flow**
   - [ ] Visit https://d3imos.com/auth/signup
   - [ ] Register new account
   - [ ] Verify password requirements enforced
   - [ ] Check email sent (if applicable)

2. **Login Flow**
   - [ ] Visit https://d3imos.com/auth/signin
   - [ ] Login with credentials
   - [ ] Verify redirect to dashboard

3. **Google OAuth Flow**
   - [ ] Click "Sign in with Google"
   - [ ] Complete Google consent
   - [ ] Verify redirect and account creation

4. **MFA Setup Flow**
   - [ ] Navigate to MFA setup
   - [ ] Scan QR code
   - [ ] Verify TOTP code
   - [ ] Enable MFA
   - [ ] Logout and verify MFA required on next login

5. **Rate Limiting**
   - [ ] Attempt 4 registrations from same IP
   - [ ] Verify 4th attempt returns 429 (Too Many Requests)

### 3. Database Verification

Check MongoDB Atlas:

```javascript
// Connect to MongoDB Atlas shell
use d3imos_auth;

// Verify indexes exist
db.users.getIndexes();
// Should show:
// - _id_ (default)
// - username_unique
// - email_unique
// - googleId_unique (sparse)
// - createdAt_index

// Verify audit logs collection exists
db.audit_logs.getIndexes();
// Should show indexes for:
// - timestamp_desc
// - userId_timestamp
// - ipAddress_timestamp
// - eventType_timestamp
// - failed_login_detection

// Check recent audit logs
db.audit_logs.find().sort({ timestamp: -1 }).limit(10);
```

### 4. Security Verification

```bash
# Check security headers
curl -I https://d3imos.com | grep -E "strict-transport-security|x-frame-options|content-security-policy"

# Verify HTTPS redirect (should redirect HTTP → HTTPS)
curl -I http://d3imos.com

# Test rate limiting (should fail on 4th attempt)
for i in {1..4}; do
  curl -X POST https://d3imos.com/api/register \
    -H "Content-Type: application/json" \
    -d '{"username":"test'$i'","email":"test'$i'@example.com","password":"Test123!","confirmPassword":"Test123!"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
done
```

## Rollback Procedure

If deployment causes issues:

### Option 1: Instant Rollback (Vercel Dashboard)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → Deployments
3. Find previous working deployment
4. Click **⋯ → Promote to Production**
5. Confirm rollback

**Time to rollback: ~30 seconds**

### Option 2: Git Revert (Source Control)
```bash
# Find commit hash of working version
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Push revert (triggers new deployment)
git push origin main
```

**Time to rollback: ~2-3 minutes (includes build time)**

### Option 3: Manual Redeploy
```bash
# Redeploy a specific commit
vercel --prod --force
```

## Monitoring & Logging

### Vercel Logs

View real-time logs:
```bash
# Stream production logs
vercel logs d3imos.com --follow

# Filter by error level
vercel logs d3imos.com --follow | grep ERROR
```

### Application Logs

Check application-specific logs:
```bash
# View deployment logs
vercel logs <deployment-url>

# Common log locations:
# - Build errors: Vercel dashboard → Build logs
# - Runtime errors: Vercel dashboard → Functions logs
# - Database errors: MongoDB Atlas → Metrics
```

### Audit Logs

Query audit logs in MongoDB Atlas:

```javascript
// Recent failed logins
db.audit_logs.find({
  eventType: "login_failed",
  timestamp: { $gte: new Date(Date.now() - 86400000) } // Last 24 hours
}).sort({ timestamp: -1 });

// Rate limit events
db.audit_logs.find({
  eventType: "rate_limit_exceeded"
}).sort({ timestamp: -1 });

// Recent registrations
db.audit_logs.find({
  eventType: "registration_success"
}).sort({ timestamp: -1 }).limit(10);
```

## Emergency Procedures

### Database Breach
1. **Immediately rotate**:
   - `MONGODB_URI` (create new database user)
   - `ENCRYPTION_KEY` (requires re-encrypting all encrypted data)
   - `NEXTAUTH_SECRET` (invalidates all sessions)

2. **Update Vercel env vars**:
   ```bash
   vercel env rm MONGODB_URI production
   vercel env add MONGODB_URI production
   # Repeat for all rotated secrets
   ```

3. **Force redeploy**:
   ```bash
   vercel --prod --force
   ```

### OAuth Compromise
1. **Google Cloud Console** → API & Services → Credentials
2. Delete compromised OAuth client
3. Create new OAuth client
4. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel
5. Redeploy

### Downtime
1. Check Vercel status: https://www.vercel-status.com/
2. Check MongoDB Atlas status: https://status.cloud.mongodb.com/
3. Review deployment logs: `vercel logs d3imos.com`
4. If application issue: rollback to last working deployment
5. If infrastructure issue: wait for provider resolution

## Performance Optimization

### Edge Caching
Vercel automatically caches:
- Static assets (CSS, JS, images)
- Static pages (if using `getStaticProps`)

**Note**: Our app uses authentication, so most pages are dynamic and not cached.

### Database Connection Pooling
MongoDB connection is reused across serverless functions:
```typescript
// lib/mongodb.ts already implements connection pooling
const clientPromise = client.connect();
```

### Image Optimization
Next.js automatically optimizes images:
```tsx
import Image from 'next/image';

<Image
  src="/profile.jpg"
  width={200}
  height={200}
  alt="Profile"
/>
```

## Cost Management

### Vercel Costs
- **Free Tier**: 100GB bandwidth/month, 100 builds/month
- **Monitor usage**: Vercel Dashboard → Usage
- **Alerts**: Set up usage alerts in Vercel settings

### MongoDB Atlas Costs
- **M0 Free Tier**: 512MB storage, shared CPU
- **Upgrade triggers**:
  - >512MB data
  - >100 connections
  - Performance degradation
- **Monitor**: MongoDB Atlas → Metrics

### Estimated Monthly Costs (Low Traffic)
- Vercel: $0 (within free tier)
- MongoDB Atlas: $0 (M0 free tier)
- **Total: $0/month**

### Estimated Monthly Costs (High Traffic - 10k+ users)
- Vercel Pro: $20/month
- MongoDB Atlas M10: $57/month
- **Total: ~$77/month**

## Development vs Production

### Local Development
```bash
# 1. Copy environment variables
cp .env.local.example .env.local

# 2. Fill in local values
# - Use localhost MongoDB or Atlas
# - Use separate Google OAuth client (with localhost callback)
# - Use different NEXTAUTH_SECRET

# 3. Start development server
pnpm dev

# 4. Test at http://localhost:3000
```

### Preview Deployments (Staging)
Every PR and non-main branch gets a preview URL:
```bash
# Push to feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Vercel creates preview: https://d3imos-git-feature-new-feature.vercel.app
```

**Preview deployments:**
- Use production environment variables
- Safe for testing (isolated URL)
- Automatically deleted when branch is merged

## Troubleshooting

### Build Fails
**Error**: "Type error: Cannot find name 'X'"
**Solution**: Run `pnpm type-check` locally to find type errors before pushing

**Error**: "Module not found"
**Solution**: Ensure `pnpm install` was run and dependencies are in `package.json`

### Runtime Errors
**Error**: "NEXTAUTH_URL not set"
**Solution**: Add `NEXTAUTH_URL` to Vercel environment variables

**Error**: "MongoServerError: Authentication failed"
**Solution**: Verify `MONGODB_URI` credentials and IP whitelist in MongoDB Atlas

### OAuth Errors
**Error**: "redirect_uri_mismatch"
**Solution**: Add `https://d3imos.com/api/auth/callback/google` to Google OAuth authorized redirect URIs

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Security Contacts

If you discover a security vulnerability:
1. **DO NOT** create a public GitHub issue
2. Email: kyle@d3imos.com (replace with your actual security contact)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

**Last Updated**: 2026-10-07
**Maintained By**: Kyle Bethke
**Production URL**: https://d3imos.com
