import { describe, expect, it } from 'vitest'

import { isJwtExpired, JWT_ACCESS_TTL_SECONDS } from '@/domain/auth/JwtPayload'
import {
  decodeAccessToken,
  issueAccessToken,
  verifyAccessToken,
} from '@/infrastructure/auth/jwtService'

describe('jwtService', () => {
  it('issues a verifiable HS256 access token', async () => {
    const { accessToken, expiresAt, payload } = await issueAccessToken({
      user: {
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
        providers: ['password'],
      },
      provider: 'password',
    })

    expect(accessToken.split('.')).toHaveLength(3)
    expect(payload.exp - payload.iat).toBe(JWT_ACCESS_TTL_SECONDS)
    expect(expiresAt).toBe(payload.exp * 1000)

    const verified = await verifyAccessToken(accessToken)
    expect(verified?.sub).toBe('user-1')
    expect(verified?.email).toBe('a@b.com')
    expect(decodeAccessToken(accessToken)?.provider).toBe('password')
  })

  it('rejects a tampered token', async () => {
    const { accessToken } = await issueAccessToken({
      user: {
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
        providers: ['google'],
      },
      provider: 'google',
    })

    const [header, body] = accessToken.split('.')
    const tampered = `${header}.${body}.invalid-signature`
    expect(await verifyAccessToken(tampered)).toBeNull()
  })

  it('rejects tokens that do not use HS256', async () => {
    const { accessToken } = await issueAccessToken({
      user: {
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
        providers: ['password'],
      },
      provider: 'password',
    })

    const [, body, signature] = accessToken.split('.')
    const noneHeader = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')
    const forged = `${noneHeader}.${body}.${signature}`
    expect(await verifyAccessToken(forged)).toBeNull()
  })

  it('detects expired payloads', () => {
    expect(isJwtExpired({ exp: Math.floor(Date.now() / 1000) - 10 })).toBe(true)
    expect(isJwtExpired({ exp: Math.floor(Date.now() / 1000) + 60 })).toBe(
      false,
    )
  })
})
