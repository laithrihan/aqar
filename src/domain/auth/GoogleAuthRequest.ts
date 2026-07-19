import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

export type GoogleAuthRequest = {
  accessToken: string
  accountType?: SignupAccountType
}
