# Contributing to d3imos.com

Welcome! This guide will help you contribute to the d3imos.com project effectively and safely.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Security Guidelines](#security-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Atlas account** (for database access)
- **Google Cloud account** (for OAuth credentials)
- **Code editor** (VS Code recommended)

### First-Time Setup

1. **Fork the repository** (if external contributor)
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/d3imos.com.git
   cd d3imos.com
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   ```

4. **Configure `.env.local`**

   **Option A: Use shared development database** (ask maintainer for credentials)
   ```bash
   MONGODB_URI=mongodb+srv://dev_user:dev_password@dev-cluster.mongodb.net/?appName=D3IMOS_Dev
   NEXTAUTH_SECRET=your-dev-secret-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-dev-client-id
   GOOGLE_CLIENT_SECRET=your-dev-client-secret
   ENCRYPTION_KEY=your-dev-encryption-key
   ```

   **Option B: Use local MongoDB** (recommended for isolated development)
   ```bash
   # Install MongoDB locally
   brew install mongodb-community@7.0  # macOS
   # or follow: https://www.mongodb.com/docs/manual/installation/

   # Start MongoDB
   brew services start mongodb-community@7.0

   # Update .env.local
   MONGODB_URI=mongodb://localhost:27017/d3imos_dev
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-dev-client-id
   GOOGLE_CLIENT_SECRET=your-dev-client-secret
   ENCRYPTION_KEY=$(openssl rand -hex 32)
   ```

5. **Create development Google OAuth credentials**

   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create new project: "d3imos-dev-[yourname]"
   3. Enable Google Calendar API
   4. Create OAuth 2.0 credentials
   5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   6. Copy Client ID and Client Secret to `.env.local`

6. **Start development server**
   ```bash
   pnpm dev
   ```

7. **Verify setup**
   - Visit http://localhost:3000
   - Create test account
   - Test Google OAuth login
   - Enable MFA and test

## Development Setup

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

Save this to `.vscode/extensions.json` (already included in repo).

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Save to `.vscode/settings.json` (already included).

## Code Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Strict mode enabled** - Fix all type errors
- **No `any` types** - Use proper typing or `unknown`
- **Use interfaces for objects** - Prefer interfaces over types for object shapes

**Good:**
```typescript
interface User {
  id: string;
  username: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  // ...
}
```

**Bad:**
```typescript
async function getUser(id: any) {  // ❌ 'any' type
  // ...
}
```

### Code Style

- **Formatting**: Prettier (runs on save)
- **Linting**: ESLint (fix before committing)
- **Naming conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Functions: camelCase (`getUserById()`)
  - Constants: UPPER_SNAKE_CASE (`MAX_LOGIN_ATTEMPTS`)
  - Files: kebab-case (`user-profile.tsx`) or PascalCase for components

### React/Next.js Best Practices

1. **Use Server Components by default**
   ```typescript
   // app/dashboard/page.tsx
   export default async function DashboardPage() {
     const session = await getServerSession(authOptions);
     // Direct database access, no API route needed
     return <div>...</div>;
   }
   ```

2. **Client Components only when needed**
   ```typescript
   'use client';  // Only add when using hooks or browser APIs

   import { useState } from 'react';

   export default function InteractiveComponent() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

3. **Use TypeScript for API routes**
   ```typescript
   // app/api/users/route.ts
   import { NextRequest, NextResponse } from 'next/server';

   export async function GET(request: NextRequest) {
     return NextResponse.json({ users: [] });
   }
   ```

### Security Standards

**CRITICAL**: Follow these security practices:

1. **Never commit secrets**
   - Check `.gitignore` includes `.env.local`
   - Use environment variables for all sensitive data
   - Run `git diff` before committing to verify no secrets

2. **Input validation**
   ```typescript
   // ✅ Good: Validate all inputs
   if (!username || typeof username !== 'string' || username.length < 3) {
     return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
   }
   ```

3. **Never trust client input**
   ```typescript
   // ❌ Bad: Using user input directly in query
   const user = await db.users.findOne({ _id: req.body.id });

   // ✅ Good: Validate and sanitize
   const { id } = req.body;
   if (!ObjectId.isValid(id)) {
     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
   }
   const user = await db.users.findOne({ _id: new ObjectId(id) });
   ```

4. **Encrypt sensitive data**
   ```typescript
   // ✅ Use crypto.ts for encrypting tokens, secrets, etc.
   import { encrypt, decrypt } from '@/lib/crypto';

   const encryptedToken = encrypt(accessToken);
   await db.users.updateOne({ _id: userId }, { $set: { googleAccessToken: encryptedToken } });
   ```

5. **Audit logging**
   ```typescript
   // ✅ Log security-relevant events
   import { logAuditEvent, AuditEventType } from '@/lib/audit-log';

   await logAuditEvent({
     eventType: AuditEventType.LOGIN_SUCCESS,
     userId: user.id,
     ipAddress: getClientIp(request),
     success: true,
   });
   ```

## Git Workflow

### Branch Naming

```
feature/add-user-settings    # New feature
fix/login-redirect-bug       # Bug fix
refactor/auth-logic          # Code refactoring
docs/update-readme           # Documentation
security/fix-xss-vulnerability  # Security fix
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile settings page
fix: resolve authentication redirect loop
docs: update deployment guide
refactor: simplify rate limiting logic
security: encrypt OAuth tokens at rest
chore: update dependencies
```

**Format:**
```
<type>: <short description>

[optional body with detailed explanation]

[optional footer: "Fixes #123"]
```

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/user-settings

# 2. Make changes and commit frequently
git add .
git commit -m "feat: add user settings form"

# 3. Keep branch up to date with main
git fetch origin
git rebase origin/main

# 4. Run checks before pushing
pnpm type-check
pnpm lint
pnpm build  # Ensure build succeeds

# 5. Push to your fork/branch
git push origin feature/user-settings

# 6. Open Pull Request on GitHub
```

## Testing

### Manual Testing Checklist

Before submitting PR, test:

- [ ] **Registration**: Create new account with strong password
- [ ] **Login**: Login with username/password
- [ ] **Google OAuth**: Login with Google account
- [ ] **MFA Setup**: Enable MFA, scan QR code, verify TOTP
- [ ] **MFA Login**: Login with MFA-enabled account
- [ ] **Rate Limiting**: Trigger rate limit (4 registration attempts)
- [ ] **Session Persistence**: Refresh page, verify still logged in
- [ ] **Logout**: Logout and verify redirect
- [ ] **Protected Routes**: Visit protected page without login, verify redirect

### Testing API Endpoints

```bash
# Registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!"
  }'

# Login (via NextAuth)
# Use browser or Postman for OAuth flow

# MFA Setup
curl http://localhost:3000/api/mfa/setup \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Database Testing

```bash
# Connect to local MongoDB
mongosh

# Switch to dev database
use d3imos_dev;

# View users
db.users.find().pretty();

# View audit logs
db.audit_logs.find().sort({ timestamp: -1 }).limit(10).pretty();

# Clear test data
db.users.deleteMany({ email: /test@example.com/ });
db.audit_logs.deleteMany({});
```

## Pull Request Process

### Before Submitting PR

1. **Run all checks**
   ```bash
   pnpm type-check  # Must pass
   pnpm lint        # Must pass
   pnpm build       # Must succeed
   ```

2. **Test your changes**
   - Follow manual testing checklist
   - Test edge cases
   - Test error handling

3. **Update documentation**
   - Update README.md if adding features
   - Update DEPLOYMENT.md if changing deployment process
   - Add code comments for complex logic

4. **Self-review your code**
   - Remove console.logs
   - Remove commented-out code
   - Check for TODOs (resolve or create issues)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Security fix

## Testing
- [ ] Tested locally
- [ ] All checks pass (type-check, lint, build)
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No secrets committed
- [ ] Security implications considered
```

### Review Process

1. **Automated checks** run on PR (Vercel preview build)
2. **Maintainer review** (1-2 business days)
3. **Address feedback** (push new commits to same branch)
4. **Approval** required before merge
5. **Merge** to `main` triggers production deployment

## Code Review Guidelines

### For Reviewers

When reviewing PRs, check:

1. **Functionality**: Does it work as intended?
2. **Security**: Any vulnerabilities introduced?
3. **Performance**: Any performance implications?
4. **Code quality**: Readable, maintainable?
5. **Tests**: Adequate testing?
6. **Documentation**: Sufficient documentation?

### Providing Feedback

**Good feedback:**
```
🔒 Security concern: User input is not validated before database query.
Consider adding validation:

if (!ObjectId.isValid(userId)) {
  return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
}
```

**Bad feedback:**
```
This code is bad. ❌
```

### Addressing Feedback

- **Be receptive**: Feedback helps improve code quality
- **Ask questions**: If unclear, ask for clarification
- **Make changes**: Address all feedback before requesting re-review
- **Explain decisions**: If you disagree, explain your reasoning

## Common Tasks

### Adding a New API Route

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUsersCollection } from '@/lib/user';
import { ObjectId } from 'mongodb';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { logAuditEvent, AuditEventType } from '@/lib/audit-log';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Input validation
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  // 3. Authorization (can user access this resource?)
  if (session.user.id !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 4. Database query
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(params.id) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5. Audit logging (if security-relevant)
    await logAuditEvent({
      eventType: AuditEventType.USER_PROFILE_VIEWED,
      userId: session.user.id,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
      success: true,
    });

    // 6. Return response (exclude sensitive fields)
    const { hashedPassword, mfaSecret, googleRefreshToken, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Adding a New Page

```typescript
// app/settings/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  // Server Component: Direct session access
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <SettingsForm userId={session.user.id} />
    </div>
  );
}
```

```typescript
// app/settings/SettingsForm.tsx
'use client';

import { useState } from 'react';

interface SettingsFormProps {
  userId: string;
}

export default function SettingsForm({ userId }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* settings */ }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      // Success feedback
      alert('Settings updated!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
```

### Adding Database Indexes

```typescript
// lib/db-init.ts
export async function initializeDatabase() {
  try {
    const users = await getUsersCollection();

    await Promise.all([
      // Existing indexes...

      // New index
      users.createIndex(
        { lastLoginAt: -1 },  // -1 = descending (newest first)
        {
          name: 'lastLoginAt_desc',
          background: true,  // Don't block other operations
        }
      ),
    ]);

    console.log('✅ Database indexes initialized successfully');
  } catch (error) {
    console.error('⚠️  Database index initialization failed:', error);
  }
}
```

### Adding Audit Log Event

```typescript
// 1. Add event type to lib/audit-log.ts
export enum AuditEventType {
  // Existing events...

  // New event
  USER_SETTINGS_UPDATED = 'user_settings_updated',
}

// 2. Create helper function (optional)
export async function logSettingsUpdate(params: {
  userId: string;
  ipAddress: string;
  userAgent?: string;
  changedFields: string[];
}) {
  await logAuditEvent({
    eventType: AuditEventType.USER_SETTINGS_UPDATED,
    userId: params.userId,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    success: true,
    metadata: {
      changedFields: params.changedFields,
    },
  });
}

// 3. Use in API route
import { logSettingsUpdate } from '@/lib/audit-log';

await logSettingsUpdate({
  userId: session.user.id,
  ipAddress: getClientIp(request),
  userAgent: getUserAgent(request),
  changedFields: ['email', 'username'],
});
```

## Questions?

- **General questions**: Open a [Discussion](https://github.com/yourusername/d3imos.com/discussions)
- **Bug reports**: Open an [Issue](https://github.com/yourusername/d3imos.com/issues)
- **Security vulnerabilities**: Email kyle@d3imos.com (do NOT create public issue)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to d3imos.com!** 🎉

Your contributions help make this project better for everyone.
