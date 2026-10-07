import clientPromise from './mongodb';

/**
 * Feelix Brothers Audit Logging System
 *
 * Educational: Audit logs are critical for security monitoring and compliance
 *
 * Why audit logs matter:
 * 1. Detection: Identify brute force attacks, credential stuffing, etc.
 * 2. Investigation: Forensic evidence when breach occurs
 * 3. Compliance: Required by PCI-DSS, SOC2, HIPAA, etc.
 * 4. Analytics: User behavior patterns, feature usage
 *
 * What to log:
 * - Who: userId (if authenticated) or IP address (if not)
 * - What: Action performed (login, registration, etc.)
 * - When: Timestamp (UTC)
 * - Where: IP address, user agent, location (optional)
 * - Result: Success or failure
 * - Context: Additional metadata (error codes, etc.)
 *
 * Security considerations:
 * - Don't log passwords or sensitive tokens
 * - Redact PII if required by regulations (GDPR)
 * - Logs should be append-only (immutable)
 * - Retention policy (keep for X days, then archive/delete)
 */

export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',

  // Registration events
  REGISTRATION_SUCCESS = 'registration_success',
  REGISTRATION_FAILED = 'registration_failed',

  // MFA events
  MFA_SETUP_STARTED = 'mfa_setup_started',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  MFA_VERIFICATION_FAILED = 'mfa_verification_failed',

  // Security events
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_TOKEN = 'invalid_token',
  PASSWORD_CHANGE = 'password_change',

  // OAuth events
  OAUTH_LINK_SUCCESS = 'oauth_link_success',
  OAUTH_LINK_FAILED = 'oauth_link_failed',
}

export interface AuditLogEntry {
  // Event details
  eventType: AuditEventType;
  timestamp: Date;

  // User context
  userId?: string; // If authenticated
  username?: string; // For easier querying
  email?: string;

  // Request context
  ipAddress: string;
  userAgent?: string;

  // Result
  success: boolean;

  // Additional metadata
  metadata?: {
    errorCode?: string;
    errorMessage?: string;
    [key: string]: any;
  };
}

const DATABASE_NAME = 'd3imos_auth';
const AUDIT_LOGS_COLLECTION = 'audit_logs';

/**
 * Get audit logs collection
 */
async function getAuditLogsCollection() {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  return db.collection<AuditLogEntry>(AUDIT_LOGS_COLLECTION);
}

/**
 * Log an audit event
 *
 * Educational: This is an async fire-and-forget operation
 * We don't want audit logging to slow down user requests
 * If logging fails, we log the error but don't crash the app
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  try {
    const logs = await getAuditLogsCollection();

    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    // Fire and forget - don't await
    // Educational: In production, you might want to use a queue (Redis, SQS)
    // to ensure logs are never lost, even if MongoDB is down
    logs.insertOne(fullEntry).catch(err => {
      // Log to console as fallback (Vercel logs will capture this)
      console.error('[AUDIT LOG ERROR]', {
        event: entry.eventType,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    });
  } catch (error) {
    // Swallow errors - we don't want audit logging to break the app
    console.error('[AUDIT LOG ERROR] Failed to initialize collection:', error);
  }
}

/**
 * Helper: Log authentication attempt
 */
export async function logAuthAttempt(params: {
  username: string;
  success: boolean;
  ipAddress: string;
  userAgent?: string;
  userId?: string;
  errorMessage?: string;
  mfaRequired?: boolean;
}) {
  await logAuditEvent({
    eventType: params.success ? AuditEventType.LOGIN_SUCCESS : AuditEventType.LOGIN_FAILED,
    userId: params.userId,
    username: params.username,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    success: params.success,
    metadata: {
      errorMessage: params.errorMessage,
      mfaRequired: params.mfaRequired,
    },
  });
}

/**
 * Helper: Log registration attempt
 */
export async function logRegistration(params: {
  username: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent?: string;
  userId?: string;
  errorMessage?: string;
}) {
  await logAuditEvent({
    eventType: params.success ? AuditEventType.REGISTRATION_SUCCESS : AuditEventType.REGISTRATION_FAILED,
    userId: params.userId,
    username: params.username,
    email: params.email,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    success: params.success,
    metadata: {
      errorMessage: params.errorMessage,
    },
  });
}

/**
 * Helper: Log MFA event
 */
export async function logMfaEvent(params: {
  eventType: AuditEventType.MFA_SETUP_STARTED | AuditEventType.MFA_ENABLED | AuditEventType.MFA_DISABLED | AuditEventType.MFA_VERIFICATION_FAILED;
  userId: string;
  username?: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}) {
  await logAuditEvent({
    eventType: params.eventType,
    userId: params.userId,
    username: params.username,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    success: params.success,
    metadata: {
      errorMessage: params.errorMessage,
    },
  });
}

/**
 * Helper: Log rate limit exceeded
 */
export async function logRateLimitExceeded(params: {
  ipAddress: string;
  userAgent?: string;
  endpoint: string;
  limit: number;
}) {
  await logAuditEvent({
    eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    success: false,
    metadata: {
      endpoint: params.endpoint,
      limit: params.limit,
    },
  });
}

/**
 * Initialize audit log indexes
 * Educational: Called on app startup to ensure indexes exist
 */
export async function initializeAuditLogIndexes() {
  try {
    const logs = await getAuditLogsCollection();

    await Promise.all([
      // Index by timestamp for time-range queries
      logs.createIndex(
        { timestamp: -1 },
        { name: 'timestamp_desc', background: true }
      ),

      // Index by userId for user activity history
      logs.createIndex(
        { userId: 1, timestamp: -1 },
        { name: 'userId_timestamp', background: true }
      ),

      // Index by IP address for detecting brute force from same IP
      logs.createIndex(
        { ipAddress: 1, timestamp: -1 },
        { name: 'ipAddress_timestamp', background: true }
      ),

      // Index by event type for filtering
      logs.createIndex(
        { eventType: 1, timestamp: -1 },
        { name: 'eventType_timestamp', background: true }
      ),

      // Compound index for failed login detection
      logs.createIndex(
        { eventType: 1, success: 1, ipAddress: 1, timestamp: -1 },
        { name: 'failed_login_detection', background: true }
      ),
    ]);

    console.log('✅ Audit log indexes initialized');
  } catch (error) {
    console.error('⚠️  Audit log index initialization failed:', error);
  }
}

/**
 * Educational: Example queries for security monitoring
 *
 * 1. Detect brute force attack (many failed logins from same IP):
 * ```
 * db.audit_logs.aggregate([
 *   {
 *     $match: {
 *       eventType: "login_failed",
 *       timestamp: { $gte: new Date(Date.now() - 3600000) } // Last hour
 *     }
 *   },
 *   { $group: { _id: "$ipAddress", count: { $sum: 1 } } },
 *   { $match: { count: { $gte: 5 } } },
 *   { $sort: { count: -1 } }
 * ])
 * ```
 *
 * 2. User's recent activity:
 * ```
 * db.audit_logs.find({
 *   userId: "507f1f77bcf86cd799439011"
 * }).sort({ timestamp: -1 }).limit(50)
 * ```
 *
 * 3. All registrations in last 24 hours:
 * ```
 * db.audit_logs.find({
 *   eventType: "registration_success",
 *   timestamp: { $gte: new Date(Date.now() - 86400000) }
 * })
 * ```
 */
