import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

export type AuthProvider = 'google' | 'password'

export type AuthUser = {
  id: string
  email: string
  name: string
  picture?: string
  accountType?: SignupAccountType
  provider: AuthProvider
  providers: AuthProvider[]
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  expiresAt: number
}

export function isAuthSessionExpired(
  session: Pick<AuthSession, 'expiresAt'>,
  nowMs = Date.now(),
): boolean {
  return session.expiresAt <= nowMs
}
