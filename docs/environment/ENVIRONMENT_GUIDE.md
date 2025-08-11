# Environment Configuration Guide

This document provides a comprehensive overview of environment setup for the Metric Mapping application across all deployment stages.

> **🔒 Sensitive Information**: For actual keys and secrets, see `ENVIRONMENT_SECRETS.md` (gitignored file for team reference only)

## 🏗️ Environment Overview

The application supports three distinct environments:

| Environment     | Domain            | Database            | Authentication    | Variables Source  |
| --------------- | ----------------- | ------------------- | ----------------- | ----------------- |
| **Development** | `localhost:5173`  | Local Supabase      | Development Clerk | Local `.env` file |
| **Staging**     | `dev.canvasm.app` | Production Supabase | Production Clerk  | Vercel (shared)   |
| **Production**  | `use.canvasm.app` | Production Supabase | Production Clerk  | Vercel (shared)   |

## 🔑 Authentication Setup

### Development Clerk

- **Domain**: Development Clerk domain (e.g., `https://your-dev-app.clerk.accounts.dev`)
- **Purpose**: Local development and testing
- **Key Pattern**: `pk_test_*` (development key)
- **Integration**: Connected to local Supabase instance

### Production Clerk

- **Domain**: Production Clerk domain
- **Purpose**: Staging and production environments
- **Key Pattern**: `pk_live_*` or production key
- **Integration**: Connected to production Supabase instance
- **Shared**: Used by both staging and production

## 📋 Environment Variables

### Development Environment (Local `.env`)

**File**: `.env` (local only, not committed to git)

```bash
# Development Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_development_clerk_key

# Local Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_supabase_anon_key

# Development App URL
VITE_APP_URL=http://localhost:5173
```

**Characteristics**:

- ✅ Uses **Development Clerk** (development domain)
- ✅ Uses **local Supabase** instance (localhost:54321)
- ✅ Uses **demo/development keys**
- ✅ **Bypasses RLS** for easier development
- ✅ **No authentication required** for development features

### Production & Staging Environment (Vercel)

**Source**: Automatically provided by Vercel integrations

```bash
# Production Supabase (via Supabase Integration)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Production Clerk (Shared Environment Variables)
VITE_CLERK_PUBLISHABLE_KEY=your-production-clerk-key
```

**Characteristics**:

- ✅ Uses **Production Clerk** (production domain)
- ✅ Uses **production Supabase** instance
- ✅ Uses **production keys**
- ✅ **Enforces RLS** for security
- ✅ **Requires authentication** for all operations
- ✅ **Shared between staging and production**

## 🔧 Environment Detection

The application automatically detects the environment using this logic:

```typescript
// Enhanced environment detection
const isDevelopmentEnvironment = () => {
  // Check both Vite and Supabase integration variables
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;

  // Check for local development URLs
  const isLocal =
    supabaseUrl.includes('127.0.0.1') ||
    supabaseUrl.includes('localhost') ||
    supabaseUrl.includes('0.0.0.0');

  console.log('🔧 Environment detection:', {
    supabaseUrl,
    isLocal,
    isDevelopment: isLocal,
  });

  return isLocal;
};
```

**Detection Logic**:

- **Development**: `VITE_SUPABASE_URL` contains localhost/127.0.0.1
- **Staging/Production**: `NEXT_PUBLIC_SUPABASE_URL` contains remote URL

## 🎯 Environment-Specific Behavior

### Development Environment

| Feature            | Behavior                 | Reason                    |
| ------------------ | ------------------------ | ------------------------- |
| **Authentication** | ❌ Bypassed              | Faster development        |
| **RLS Policies**   | ❌ Bypassed              | No permission blocks      |
| **Database**       | 🏠 Local Supabase        | Isolated testing          |
| **Clerk Domain**   | Development Clerk domain | Development instance      |
| **Debug Features** | ✅ Enabled               | Development tools         |
| **Service Role**   | ✅ Used                  | Bypasses all restrictions |

### Staging Environment (`dev.canvasm.app`)

| Feature            | Behavior               | Reason                  |
| ------------------ | ---------------------- | ----------------------- |
| **Authentication** | ✅ Required            | Production-like testing |
| **RLS Policies**   | ✅ Enforced            | Security testing        |
| **Database**       | 🌐 Production Supabase | Real data testing       |
| **Clerk Domain**   | Production domain      | Real authentication     |
| **Debug Features** | ❌ Disabled            | Production-like         |
| **User Isolation** | ✅ Enforced            | Security verification   |

### Production Environment (`use.canvasm.app`)

| Feature            | Behavior               | Reason          |
| ------------------ | ---------------------- | --------------- |
| **Authentication** | ✅ Required            | Security        |
| **RLS Policies**   | ✅ Enforced            | Data protection |
| **Database**       | 🌐 Production Supabase | Live data       |
| **Clerk Domain**   | Production domain      | Real users      |
| **Debug Features** | ❌ Disabled            | Security        |
| **User Isolation** | ✅ Enforced            | Privacy         |

## 🚀 Setup Instructions

### Development Setup

1.  **Install Supabase CLI**:

    ```bash
    npm install -g supabase
    ```

2.  **Start local Supabase**:

    ```bash
    supabase start
    ```

3.  **Create `.env` file**:

        ```bash

    # Create .env with development values

    VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_development_clerk_key
    VITE_SUPABASE_URL=http://127.0.0.1:54321
    VITE_SUPABASE_ANON_KEY=your_local_supabase_anon_key
    VITE_SUPABASE_SERVICE_ROLE_KEY=your_local_supabase_service_role_key

    ```

    ```

4.  **Start development server**:

    ```bash
    npm run dev
    ```

5.  **Access the application**:
    - **App**: http://localhost:5173
    - **Supabase Studio**: http://localhost:54323

### Production/Staging Setup

**No manual setup required** - automatically configured via Vercel integrations:

1. **Supabase Integration**: Provides database connection variables
2. **Shared Environment Variables**: Contains production Clerk key
3. **Automatic Deployment**: Via git push to main branch

## 📊 Vercel Dashboard Configuration

### Environment Variables (Automatically Set)

**From Supabase Integration**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`

**Shared Environment Variables** (Manual):

- `VITE_CLERK_PUBLISHABLE_KEY`: Production Clerk key

### Deployment Process

1. **Push to repository** → Automatic deployment
2. **Environment variables** → Automatically applied
3. **Build process** → Uses production variables
4. **Domain routing**:
   - `main` branch → `canvasm.app` (production)
   - `develop` branch → `dev.canvasm.app` (staging)

## 🛠️ Troubleshooting

### Development Issues

**Problem**: "VITE_SUPABASE_URL is required"

```bash
# Solution: Ensure .env file exists with correct values
cp .env.example .env
# Edit with local development values
```

**Problem**: Supabase connection failed

```bash
# Solution: Start local Supabase instance
supabase start
```

**Problem**: Authentication not working in development

```bash
# Expected behavior: Authentication is bypassed in development
# Check logs for "🔧 Development mode detected"
```

**Problem**: "VITE_SUPABASE_SERVICE_ROLE_KEY is required for local development"

```bash
# Solution: Add service role key to .env file
# Get from local Supabase instance: supabase status
# Or from Supabase Studio: http://localhost:54323
```

### Staging/Production Issues

**Problem**: "Supabase URL is required"

- **Solution**: Check Supabase integration in Vercel dashboard
- **Verify**: `NEXT_PUBLIC_SUPABASE_URL` is set

**Problem**: Authentication not working

- **Solution**: Verify production Clerk key in shared environment variables
- **Check**: Clerk domain matches production instance

**Problem**: RLS blocking operations

- **Expected**: RLS is enforced in staging/production
- **Solution**: Ensure proper authentication flow

## 🔐 Security Considerations

### Development Environment

- ✅ **Safe for development**: Uses demo keys and local data
- ✅ **Isolated**: No access to production data
- ❌ **Not secure**: Authentication and RLS bypassed
- ⚠️ **Never commit**: `.env` file in `.gitignore`

### Staging Environment

- ✅ **Production-like**: Same security as production
- ✅ **Real authentication**: Production Clerk instance
- ✅ **RLS enforced**: Proper data isolation
- ✅ **Safe testing**: Uses production security model

### Production Environment

- ✅ **Fully secure**: All security measures active
- ✅ **User isolation**: RLS policies enforced
- ✅ **Real authentication**: Production Clerk
- ✅ **Data protection**: Complete security model

## 📋 Environment Checklist

### Development ✅

- [ ] Local Supabase running (`supabase start`)
- [ ] `.env` file with development values
- [ ] Development Clerk key (`pk_test_*`)
- [ ] Supabase service role key configured
- [ ] Authentication bypass working
- [ ] Debug features available

### Staging ✅

- [ ] Vercel deployment successful
- [ ] Supabase integration variables set
- [ ] Production Clerk key configured
- [ ] Authentication required and working
- [ ] RLS policies enforced

### Production ✅

- [ ] Production domain configured
- [ ] All environment variables set
- [ ] Authentication flow tested
- [ ] Security measures verified
- [ ] Performance optimized

## 🔄 Migration Process

### Development → Staging

1. **Test locally** with development environment
2. **Push to repository** → Automatic Vercel deployment
3. **Environment switch** → Automatic (Vercel variables)
4. **Verify functionality** in staging environment

### Staging → Production

1. **Thorough testing** in staging environment
2. **Deploy to main branch** → Production deployment
3. **Same variables** → No configuration changes needed
4. **Monitor production** for any issues

## 📝 Best Practices

1. **Environment Separation**:
   - ✅ Use different Clerk instances for dev/prod
   - ✅ Keep development data separate from production
   - ✅ Test in staging before production deployment

2. **Security**:
   - ✅ Never commit `.env` files
   - ✅ Use different keys for each environment
   - ✅ Monitor authentication flows in production

3. **Development Workflow**:
   - ✅ Start with local development
   - ✅ Test in staging environment
   - ✅ Deploy to production with confidence

4. **Monitoring**:
   - ✅ Check Vercel deployment logs
   - ✅ Monitor authentication metrics
   - ✅ Verify RLS policy effectiveness

---

## 🎯 Quick Reference

| Need                  | Environment | Command          | URL                     |
| --------------------- | ----------- | ---------------- | ----------------------- |
| **Local Development** | Development | `npm run dev`    | http://localhost:5173   |
| **Local Database**    | Development | `supabase start` | http://localhost:54323  |
| **Staging Testing**   | Staging     | Push to repo     | https://dev.canvasm.app |
| **Production**        | Production  | Push to main     | https://use.canvasm.app |

**Remember**: Development uses local everything, while staging and production share the same remote environment with production security! 🎉
