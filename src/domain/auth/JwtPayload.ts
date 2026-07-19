import type { AuthProvider } from '@/domain/auth/AuthSession'
import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

export type JwtPayload = {
  sub: string
  email: string
  name: string
  picture?: string
  accountType?: SignupAccountType
  provider: AuthProvider
  providers: AuthProvider[]
  iat: number
  exp: number
}

export const JWT_ACCESS_TTL_SECONDS = 60 * 60 // 1 hour

export function isJwtExpired(
  payload: Pick<JwtPayload, 'exp'>,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  return payload.exp <= nowSeconds
}
