# Environment Configuration Guide

## Environment Variables Setup

All environment variables should be stored in `.env.local` at the project root (not in git).

### Required Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Development Server
VITE_API_URL=http://localhost:5173
VITE_API_TIMEOUT=30000
```

## How to Get Supabase Credentials

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up or login
3. Click "New Project"
4. Fill in project details:
   - **Name**: meri-pahal-job-portal
   - **Database Password**: Create strong password
   - **Region**: Choose nearest region (Asia/India)
5. Click "Create new project"

### Step 2: Get API Keys
1. Once project is created, go to **Settings** → **API**
2. You'll see:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon [public]** → `VITE_SUPABASE_ANON_KEY`
   - **service_role [secret]** → Keep this secret!

### Step 3: Set Local Variables
Create `.env.local` file in project root:
```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Verify Connection
Run dev server:
```bash
npm run dev
```

Check browser console for:
```
✓ Supabase client initialized
✓ Ready to connect
```

## Development Environment

### Local Setup
```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Dev Server Configuration
```bash
# Dev server runs at:
http://localhost:5173

# With hash routing for testing GitHub Pages paths:
http://localhost:5173/#/jobs
http://localhost:5173/#/job/:id
http://localhost:5173/#/post-job
```

## Production Environment

### Build Configuration
```bash
npm run build
```

Creates optimized build in `/dist`:
- Minified JavaScript
- Optimized CSS
- Image compression
- Tree shaking
- Code splitting

### Environment Variables in Production
1. Set same variables in deployment platform:
   - GitHub Secrets (for Actions)
   - Vercel Environment
   - Netlify Deploy Settings
   - etc.

2. GitHub Actions uses these via:
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## Supabase Environment Setup

### 1. Authentication
Go to **Authentication** settings:
- Enable Email/Password
- Configure email templates
- Set redirect URLs to your domain:
  ```
  https://joonwebsite-wq.github.io/onspace-9b5ae1-14219/
  http://localhost:5173/
  ```

### 2. Database
Go to **SQL Editor** → Create new query:
- Run entire `DATABASE_SCHEMA.sql`
- Verify all tables created
- Check RLS policies enabled

### 3. Storage
Go to **Storage** → Create bucket:
- Bucket name: `applicant-documents`
- Make public (for resume downloads)
- Set max file size: 5MB
- Allowed MIME types: `application/pdf`

### 4. API Rate Limits
Go to **Settings** → Project settings:
- Free tier: 50k requests/month
- Monitor usage in database stats
- Upgrade plan if needed

## Environment Variable Types

### Public Variables (Exposed to Client)
Prefix with `VITE_`:
```env
VITE_SUPABASE_URL=...
VITE_API_URL=...
```

These are safe to expose - they're accessible from browser anyway.

### Secret Variables (Node.js Only)
No prefix:
```env
DB_PASSWORD=...
ADMIN_API_KEY=...
```

These stay on server and are not included in frontend bundle.

## Example .env.local File

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FiY2QxMjM0LnN1cGFiYXNlLmNvIiwic3ViIjoicG9zdGdyZXMuY29udHJpYnV0b3IiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE5MDAwMDAwLCJpYXQiOjE2OTYwMDAwMDAsImVtYWlsX2NvbmZpcm1lZCI6ZmFsc2UsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6InN1cGFiYXNlIiwicHJvdmlkZXJzIjpbInN1cGFiYXNlIl19fQ.random_signature

# ============================================
# API CONFIGURATION
# ============================================
VITE_API_URL=http://localhost:5173
VITE_API_TIMEOUT=30000

# ============================================
# FEATURE FLAGS (Optional)
# ============================================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME=true
```

## Checking Variables Loaded

Add this to check if variables loaded correctly:

```typescript
// src/lib/debug.ts
export function debugEnv() {
  console.log('Environment Variables:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
}

// Then call in App.tsx:
import { debugEnv } from '@/lib/debug';
useEffect(() => {
  if (import.meta.env.DEV) {
    debugEnv();
  }
}, []);
```

## Troubleshooting

### Variables Not Loading
1. Check `.env.local` exists in project root
2. Restart dev server: `npm run dev`
3. Clear `.next` or build cache
4. Check variable names (case-sensitive!)

### Connection Failed
1. Copy exact URL from Supabase dashboard
2. Check URL has no trailing slash
3. Verify ANON_KEY is not the service_role key
4. Check internet connection

### Supabase Returns Errors
1. Verify database tables exist
2. Check RLS policies
3. Review error message in console
4. Check Supabase dashboard logs

### Wrong Region Selected
1. Go to Supabase Settings
2. Check selected region
3. For India: Select "Singapore" or "Mumbai" (if available)
4. Note: Changing region requires creating new project

## Security Tips

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Never share ANON_KEY in code comments**
3. **Use service_role key only on server** (with extreme caution)
4. **Rotate keys regularly** in production
5. **Enable RLS on all tables** (prevents unauthorized access)
6. **Set proper CORS origins** in Supabase dashboard
7. **Use signed URLs** for temporary file access

## Deployment Platforms

### GitHub Pages (Current)
Variables stored in:
- GitHub Secrets → Settings → Secrets and variables
- Used by GitHub Actions workflow

### Vercel
Variables stored in:
- Project Settings → Environment Variables
- Different for Preview/Production

### Netlify
Variables stored in:
- Site settings → Build & deploy → Environment
- Used during build process

### Docker/Self-Hosted
Store in:
- `.env.production` file
- Docker secrets
- Environment variable injection

## Reference

**Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html
**Supabase Docs**: https://supabase.com/docs
**PostgreSQL Guide**: https://www.postgresql.org/docs

---

**Last Updated**: February 27, 2026
**Version**: 1.0.0
