/**
 * MOCK ONLY — SHA-256 password hashing for the local mock registry.
 * Uses a fixed pepper and no per-user salt; hashes may live in localStorage.
 * Replace with a server-side KDF (bcrypt/argon2) when the auth API exists.
 * Do not use this for production credentials.
 */

const PEPPER = 'aqar-mock-password-pepper'

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${PEPPER}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return `sha256:${toHex(digest)}`
}

export async function verifyPassword(
  password: string,
  passwordHash: string | undefined,
): Promise<boolean> {
  if (!passwordHash) return false
  const hashed = await hashPassword(password)
  return hashed === passwordHash
}
