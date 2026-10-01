# Authentication System Setup Guide

Congratulations! You've successfully built a secure authentication system with username/password login and Two-Factor Authentication (2FA/MFA)!

## What You've Built

### Features
- ✅ User Registration (username, email, password)
- ✅ Secure Password Hashing with bcrypt
- ✅ User Login with NextAuth.js
- ✅ Two-Factor Authentication (TOTP - works with Google Authenticator, Authy, etc.)
- ✅ Protected Dashboard
- ✅ Session Management
- ✅ Beautiful UI with MUI Joy

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Password Hashing**: bcryptjs
- **MFA**: otpauth (TOTP)
- **UI**: MUI Joy Components

## Setup Instructions

### Step 1: Set up MongoDB

You need a MongoDB database. Here are your options:

#### Option A: MongoDB Atlas (Free Cloud Database - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Create a database user:
   - Click "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose a username and password (save these!)
5. Whitelist your IP:
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development only!)
6. Get your connection string:
   - Click "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password

#### Option B: Local MongoDB
1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/
2. Start MongoDB: `mongod`
3. Your connection string will be: `mongodb://localhost:27017/`

### Step 2: Configure Environment Variables

Edit the `.env.local` file and add your MongoDB connection string:

```bash
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3004
NEXT_PUBLIC_APP_NAME=Kyle Bethke Portfolio
```

**Important**:
- Replace the `MONGODB_URI` with your actual MongoDB connection string!
- Generate a new `NEXTAUTH_SECRET` by running: `openssl rand -base64 32`

### Step 3: Restart the Development Server

After updating the `.env.local` file, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again:
npm run dev
```

## How to Use

### 1. Create an Account
1. Navigate to: http://localhost:3004/auth/signup
2. Fill in:
   - Username (3-20 characters, letters, numbers, underscore)
   - Email
   - Password (at least 8 characters)
   - Confirm Password
3. Click "Sign Up"

### 2. Sign In
1. Navigate to: http://localhost:3004/auth/signin
2. Enter your username and password
3. Click "Sign In"

### 3. Set up Two-Factor Authentication (Optional but Recommended!)
1. After signing in, you'll be at: http://localhost:3004/dashboard
2. Click "Enable 2FA"
3. Install an authenticator app on your phone:
   - Google Authenticator (iOS/Android)
   - Authy (iOS/Android)
   - Microsoft Authenticator (iOS/Android)
4. Scan the QR code with your authenticator app
5. Enter the 6-digit code from the app
6. Click "Verify & Enable"

### 4. Sign In with 2FA
1. Go to sign in page
2. Enter username and password
3. You'll be prompted for a 2FA code
4. Open your authenticator app
5. Enter the 6-digit code
6. Click "Sign In"

## File Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/  # NextAuth.js configuration
│   ├── register/            # User registration endpoint
│   └── mfa/
│       ├── setup/           # Generate MFA QR code
│       ├── verify/          # Verify MFA code
│       └── disable/         # Disable MFA
├── auth/
│   ├── signin/              # Login page
│   ├── signup/              # Registration page
│   └── error/               # Error page
├── dashboard/               # Protected dashboard page
├── layout.tsx               # Root layout with SessionProvider
└── providers.tsx            # NextAuth SessionProvider wrapper

lib/
├── mongodb.ts               # MongoDB connection
└── user.ts                  # User database functions

middleware.ts                # Route protection middleware
types/
└── next-auth.d.ts          # TypeScript types for NextAuth
```

## Security Best Practices

### Password Security
- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ Passwords must be at least 8 characters
- ✅ Passwords are never stored in plain text
- ✅ Passwords are never logged or exposed in API responses

### Session Security
- ✅ JWT tokens are signed with a secret
- ✅ Sessions expire after 30 days
- ✅ Secure HTTP-only cookies (in production)

### MFA Security
- ✅ TOTP (Time-based One-Time Password) algorithm
- ✅ Secrets are securely generated and stored
- ✅ 30-second time window for codes
- ✅ 1-step tolerance for time drift

### Additional Recommendations
- Use HTTPS in production (NextAuth requires it)
- Use a strong NEXTAUTH_SECRET (already generated)
- Keep your MongoDB credentials secure
- Don't commit `.env.local` to git (already in .gitignore)

## Testing Checklist

- [ ] Can create a new account
- [ ] Cannot create duplicate username
- [ ] Cannot create duplicate email
- [ ] Password must be at least 8 characters
- [ ] Can sign in with correct credentials
- [ ] Cannot sign in with wrong password
- [ ] Can access dashboard when signed in
- [ ] Cannot access dashboard when signed out
- [ ] Can enable 2FA
- [ ] Can sign in with 2FA code
- [ ] Cannot sign in with wrong 2FA code
- [ ] Can disable 2FA
- [ ] Can sign out

## Troubleshooting

### "Please add your MongoDB URI to .env.local"
- Make sure you've added your MongoDB connection string to `.env.local`
- Restart the dev server after updating `.env.local`

### "Cannot connect to MongoDB"
- Check your MongoDB connection string is correct
- Make sure your IP is whitelisted in MongoDB Atlas
- Make sure your database user password is correct

### "Invalid username or password"
- Check that you're using the correct username (not email)
- Usernames are case-insensitive
- Make sure you registered successfully

### "MFA code invalid"
- Make sure your phone's time is synchronized
- The code changes every 30 seconds, try the latest code
- Check that you scanned the correct QR code

## What's Next?

Now that you have authentication working, here are some ideas to extend it:

1. **Email Verification**: Send a verification email when users sign up
2. **Password Reset**: Allow users to reset their password via email
3. **OAuth Providers**: Add Google/GitHub sign-in with NextAuth
4. **User Profiles**: Add profile pictures and bio
5. **Admin Panel**: Create an admin role with special permissions
6. **Audit Logs**: Track login attempts and security events
7. **Rate Limiting**: Prevent brute force attacks
8. **Password Strength Meter**: Show password strength on registration
9. **Remember Me**: Add a "remember me" checkbox
10. **Backup Codes**: Generate backup codes for 2FA recovery

## Learning Resources

- NextAuth.js Docs: https://next-auth.js.org/
- MongoDB Node Driver: https://www.mongodb.com/docs/drivers/node/
- TOTP RFC: https://tools.ietf.org/html/rfc6238
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

## Questions?

If you run into any issues or have questions, check:
1. The console for error messages
2. MongoDB Atlas logs
3. NextAuth.js documentation

Happy coding! 🎉
