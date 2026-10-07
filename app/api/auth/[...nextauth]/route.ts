import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { findUserByUsername, verifyPassword, getUsersCollection, findUserByEmail } from '@/lib/user';
import { ObjectId } from 'mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'MFA Code (if enabled)', type: 'text', required: false },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please enter username and password');
        }

        // Find user in database
        const user = await findUserByUsername(credentials.username);

        if (!user) {
          throw new Error('Invalid username or password');
        }

        // Verify password
        const isValidPassword = await verifyPassword(user, credentials.password);

        if (!isValidPassword) {
          throw new Error('Invalid username or password');
        }

        // Check if MFA is enabled
        if (user.mfaEnabled) {
          if (!credentials.mfaCode) {
            throw new Error('MFA_REQUIRED');
          }

          // Verify MFA code
          const { TOTP } = await import('otpauth');
          const totp = new TOTP({
            secret: user.mfaSecret!,
          });

          const isValidMFA = totp.validate({
            token: credentials.mfaCode,
            window: 1, // Allow 1 step before/after for time drift
          });

          if (isValidMFA === null) {
            throw new Error('Invalid MFA code');
          }
        }

        // Return user object (password excluded)
        return {
          id: user._id!.toString(),
          name: user.username,
          email: user.email,
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.mfaEnabled = user.mfaEnabled;
      }

      // Store Google OAuth tokens
      if (account?.provider === 'google') {
        const users = await getUsersCollection();

        // Find or create user
        let dbUser = await findUserByEmail(token.email!);

        if (!dbUser) {
          // Create new user from Google OAuth
          const result = await users.insertOne({
            username: token.email!.split('@')[0],
            email: token.email!,
            googleId: account.providerAccountId,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at,
            mfaEnabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          token.id = result.insertedId.toString();
        } else {
          // Update existing user with Google tokens
          await users.updateOne(
            { _id: dbUser._id },
            {
              $set: {
                googleId: account.providerAccountId,
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token,
                googleTokenExpiry: account.expires_at,
                updatedAt: new Date(),
              },
            }
          );
          token.id = dbUser._id!.toString();
        }

        // Store tokens in JWT for easy access
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.mfaEnabled = token.mfaEnabled as boolean;
        session.user.googleAccessToken = token.googleAccessToken as string;
        session.user.googleRefreshToken = token.googleRefreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days - Feelix Brothers Security
    // Educational: Shorter session = less time for attacker if JWT is stolen
    // Users will need to re-login weekly, but security is improved
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
