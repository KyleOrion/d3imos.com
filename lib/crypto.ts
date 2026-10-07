import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Feelix Brothers Encryption Module
 *
 * Educational: This module provides AES-256-GCM encryption for sensitive data at rest
 *
 * Why AES-256-GCM?
 * - AES-256: Industry standard symmetric encryption (used by banks, militaries)
 * - GCM mode: Provides both encryption AND authentication (prevents tampering)
 * - Fast enough for real-time encryption/decryption
 *
 * Security Model:
 * - Encryption key stored in environment variable (not in database)
 * - Each value gets unique IV (initialization vector) for randomness
 * - Encrypted format: IV:authTag:encryptedData (all hex encoded)
 *
 * Trade-offs:
 * ✅ If database is stolen, data is useless without encryption key
 * ✅ Authenticated encryption prevents tampering
 * ❌ Can't search encrypted fields (use separate hash for search if needed)
 * ❌ If encryption key is lost, data is unrecoverable
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get the encryption key from environment variable
 * Educational: The key MUST be 32 bytes (256 bits) for AES-256
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY not set. Generate one with: openssl rand -hex 32'
    );
  }

  // Convert hex string to buffer (must be exactly 32 bytes)
  const keyBuffer = Buffer.from(key, 'hex');

  if (keyBuffer.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be 32 bytes (64 hex characters). Current length: ${keyBuffer.length} bytes. ` +
      'Generate a new one with: openssl rand -hex 32'
    );
  }

  return keyBuffer;
}

/**
 * Encrypt a string value
 *
 * Educational: Process:
 * 1. Generate random IV (ensures same plaintext → different ciphertext each time)
 * 2. Create cipher with key + IV
 * 3. Encrypt the data
 * 4. Get authentication tag (proves data wasn't tampered with)
 * 5. Return IV:authTag:encryptedData (all needed for decryption)
 *
 * @param plaintext - The sensitive data to encrypt
 * @returns Encrypted string in format "iv:authTag:encryptedData" (hex encoded)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty string');
  }

  try {
    const key = getEncryptionKey();

    // Generate random IV (must be unique for each encryption)
    const iv = randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = createCipheriv(ALGORITHM, key, iv);

    // Encrypt the data
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get authentication tag (for tamper detection)
    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt an encrypted string
 *
 * Educational: Process:
 * 1. Parse IV, authTag, and encryptedData from stored string
 * 2. Create decipher with key + IV
 * 3. Set authentication tag (GCM will verify data wasn't tampered)
 * 4. Decrypt the data
 * 5. If authTag is invalid, decryption fails (tamper detected)
 *
 * @param encryptedData - The encrypted string from database
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty string');
  }

  try {
    const key = getEncryptionKey();

    // Parse the stored format: iv:authTag:encryptedData
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format (expected iv:authTag:encryptedData)');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    // Validate IV and authTag lengths
    if (iv.length !== IV_LENGTH) {
      throw new Error(`Invalid IV length: ${iv.length} (expected ${IV_LENGTH})`);
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error(`Invalid authTag length: ${authTag.length} (expected ${AUTH_TAG_LENGTH})`);
    }

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    // Set authentication tag (GCM will verify on final())
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8'); // Will throw if authTag is invalid

    return decrypted;
  } catch (error) {
    // Note: We don't expose detailed decryption errors to prevent oracle attacks
    throw new Error('Decryption failed (data may be corrupted or tampered with)');
  }
}

/**
 * Safely encrypt a value that might be undefined
 * Educational: Helper for optional fields like googleAccessToken
 */
export function encryptOptional(value: string | undefined): string | undefined {
  return value ? encrypt(value) : undefined;
}

/**
 * Safely decrypt a value that might be undefined
 * Educational: Helper for optional fields
 */
export function decryptOptional(value: string | undefined): string | undefined {
  return value ? decrypt(value) : undefined;
}
