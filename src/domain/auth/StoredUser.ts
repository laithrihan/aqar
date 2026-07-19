import type { AuthProvider } from '@/domain/auth/AuthSession'
import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

export type StoredUser = {
  id: string
  email: string
  username: string
  name: string
  picture?: string
  accountType?: SignupAccountType
  providers: AuthProvider[]
  passwordHash?: string
  googleSub?: string
  createdAt: string
}

export type UsersMockResponse = {
  _readme?: string
  users: StoredUser[]
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function hasProvider(
  user: StoredUser,
  provider: AuthProvider,
): boolean {
  return user.providers.includes(provider)
}

export function withLinkedProvider(
  user: StoredUser,
  provider: AuthProvider,
  extras: Partial<Pick<StoredUser, 'googleSub' | 'picture' | 'name'>> = {},
): StoredUser {
  const providers = hasProvider(user, provider)
    ? user.providers
    : [...user.providers, provider]

  return {
    ...user,
    ...extras,
    providers,
  }
}
