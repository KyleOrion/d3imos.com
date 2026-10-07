import { getUsersCollection } from './user';
import { initializeAuditLogIndexes } from './audit-log';

/**
 * Feelix Brothers Database Initialization
 *
 * Educational: This module ensures database indexes are created
 *
 * Why indexes are critical:
 * 1. Performance: O(log n) lookup instead of O(n) full table scan
 * 2. Security: Unique indexes prevent duplicate accounts (race condition protection)
 * 3. Data Integrity: Database-level constraints stronger than application-level checks
 *
 * Index types:
 * - Unique: Prevents duplicate values (username, email, googleId)
 * - Sparse: Only indexes documents where field exists (googleId)
 * - Ascending (1): Values sorted A-Z (standard for equality queries)
 *
 * When indexes are created:
 * - On first application start (if they don't exist)
 * - MongoDB createIndex is idempotent (safe to run multiple times)
 */

/**
 * Initialize database indexes
 *
 * Educational: This should be called on application startup
 * Indexes are created asynchronously if they don't exist
 */
export async function initializeDatabase() {
  try {
    const users = await getUsersCollection();

    // Create indexes in parallel for faster startup
    await Promise.all([
      // Username index
      // - Unique: No two users can have the same username
      // - Name: Descriptive name for index (visible in MongoDB Atlas)
      users.createIndex(
        { username: 1 },
        {
          unique: true,
          name: 'username_unique',
          background: true, // Don't block other operations
        }
      ),

      // Email index
      // - Unique: No two users can have the same email
      // - Critical for OAuth (Google login uses email as identifier)
      users.createIndex(
        { email: 1 },
        {
          unique: true,
          name: 'email_unique',
          background: true,
        }
      ),

      // Google ID index
      // - Unique: No two users can link the same Google account
      // - Sparse: Only index documents where googleId exists (not all users use Google OAuth)
      // Educational: Sparse prevents null values from violating uniqueness
      users.createIndex(
        { googleId: 1 },
        {
          unique: true,
          sparse: true, // Only index documents with googleId field
          name: 'googleId_unique',
          background: true,
        }
      ),

      // Created date index (for analytics/admin queries)
      // - Not unique: Multiple users can be created at same time
      // - Useful for: "Users created in last 7 days", "Monthly growth", etc.
      users.createIndex(
        { createdAt: 1 },
        {
          name: 'createdAt_index',
          background: true,
        }
      ),
    ]);

    console.log('✅ Database indexes initialized successfully');

    // Initialize audit log indexes
    await initializeAuditLogIndexes();
  } catch (error) {
    // Don't crash the app if indexes fail, but log the error
    console.error('⚠️  Database index initialization failed:', error);
    // In production, you might want to send this to error monitoring (Sentry, etc.)
  }
}

/**
 * Educational: How to verify indexes in MongoDB Atlas
 *
 * 1. Go to MongoDB Atlas → Browse Collections
 * 2. Select your database (d3imos_auth)
 * 3. Select 'users' collection
 * 4. Click 'Indexes' tab
 * 5. You should see:
 *    - _id_ (default, created by MongoDB)
 *    - username_unique
 *    - email_unique
 *    - googleId_unique (sparse)
 *    - createdAt_index
 */

/**
 * Educational: What happens when unique index is violated?
 *
 * If you try to insert a duplicate:
 * ```
 * await users.insertOne({ username: 'john', email: 'john@example.com', ... });
 * await users.insertOne({ username: 'john', email: 'jane@example.com', ... });
 * ```
 *
 * MongoDB will throw error:
 * MongoServerError: E11000 duplicate key error collection: d3imos_auth.users index: username_unique
 *
 * This is BETTER than application-level check because:
 * - Race conditions can't bypass it (atomic database operation)
 * - Works even if multiple app instances are running
 * - Enforced even if you use MongoDB shell directly
 */
