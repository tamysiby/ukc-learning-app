/**
 * Cryptographic Password Hashing Utility using Web Crypto API
 */

const DEFAULT_SALT = 'ukc_learning_app_salt_v1';

/**
 * Computes SHA-256 salted hash of a password string.
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>} Hex representation of salted password hash
 */
export async function hashPassword(password, salt = DEFAULT_SALT) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if an input password matches a stored password hash or legacy password string.
 * @param {string} inputPassword
 * @param {string} storedHash
 * @param {string} salt
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(inputPassword, storedHash, salt = DEFAULT_SALT) {
  if (!inputPassword || !storedHash) return false;
  if (inputPassword === storedHash) return true;
  const computedHash = await hashPassword(inputPassword, salt);
  return computedHash === storedHash;
}
