import type { AuthProvider, AuthUser } from '@/domain/auth/AuthSession'
import type { JwtPayload } from '@/domain/auth/JwtPayload'
import {
  isJwtExpired,
  JWT_ACCESS_TTL_SECONDS,
} from '@/domain/auth/JwtPayload'
import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

/**
 * MOCK ONLY — client-side JWT helpers for local auth until a real API exists.
 * The signing secret is exposed in the browser (Vite env). Do not treat these
 * tokens as production security; swap for backend-issued JWTs when ready.
 */

const DEFAULT_MOCK_SECRET = 'aqar-mock-jwt-secret'

type IssueJwtInput = {
  user: Pick<
    AuthUser,
    'id' | 'email' | 'name' | 'picture' | 'accountType' | 'providers'
  >
  provider: AuthProvider
  ttlSeconds?: number
}

type JwtHeader = {
  alg?: string
  typ?: string
}

function getJwtSecret(): string {
  return import.meta.env.VITE_JWT_SECRET?.trim() || DEFAULT_MOCK_SECRET
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (padded.length % 4)) % 4
  const base64 = padded + '='.repeat(padLength)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function encodeJson(value: unknown): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(value)))
}

function decodeJson<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(fromBase64Url(value))) as T
}

async function signHs256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message),
  )
  return toBase64Url(new Uint8Array(signature))
}

async function verifyHs256(
  message: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const expected = await signHs256(message, secret)
  return expected === signature
}

export async function issueAccessToken(
  input: IssueJwtInput,
): Promise<{ accessToken: string; expiresAt: number; payload: JwtPayload }> {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const ttl = input.ttlSeconds ?? JWT_ACCESS_TTL_SECONDS
  const payload: JwtPayload = {
    sub: input.user.id,
    email: input.user.email,
    name: input.user.name,
    picture: input.user.picture,
    accountType: input.user.accountType as SignupAccountType | undefined,
    provider: input.provider,
    providers: input.user.providers,
    iat: nowSeconds,
    exp: nowSeconds + ttl,
  }

  const header = encodeJson({ alg: 'HS256', typ: 'JWT' })
  const body = encodeJson(payload)
  const signingInput = `${header}.${body}`
  const signature = await signHs256(signingInput, getJwtSecret())
  const accessToken = `${signingInput}.${signature}`

  return {
    accessToken,
    expiresAt: payload.exp * 1000,
    payload,
  }
}

export function decodeAccessToken(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    return decodeJson<JwtPayload>(parts[1])
  } catch {
    return null
  }
}

export async function verifyAccessToken(
  token: string,
): Promise<JwtPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [headerPart, body, signature] = parts

  try {
    const header = decodeJson<JwtHeader>(headerPart)
    if (header.alg !== 'HS256') return null
  } catch {
    return null
  }

  const validSignature = await verifyHs256(
    `${headerPart}.${body}`,
    signature,
    getJwtSecret(),
  )
  if (!validSignature) return null

  try {
    const payload = decodeJson<JwtPayload>(body)
    if (!payload.sub || !payload.email || !payload.exp) return null
    if (isJwtExpired(payload)) return null
    return payload
  } catch {
    return null
  }
}

export function authUserFromJwtPayload(payload: JwtPayload): AuthUser {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    accountType: payload.accountType,
    provider: payload.provider,
    providers: payload.providers,
  }
}
