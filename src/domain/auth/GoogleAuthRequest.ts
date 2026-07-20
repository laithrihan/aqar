import type { SignupAccountType } from '@/domain/auth/SignupCredentials'

export type GoogleAuthRequest = {
  idToken?: string
  accessToken?: string
  accountType?: SignupAccountType
}

export function buildGoogleAuthBody(
  request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken' | 'accountType'>,
): Record<string, string> {
  const body: Record<string, string> = {}

  if (request.idToken) {
    body.idToken = request.idToken
  }

  if (request.accessToken) {
    body.accessToken = request.accessToken
  }

  if (request.accountType) {
    body.accountType = request.accountType
  }

  return body
}
