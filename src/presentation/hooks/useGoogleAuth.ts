import { useMutation } from '@tanstack/react-query'

import type { GoogleAuthRequest } from '@/domain/auth/GoogleAuthRequest'
import {
  signInWithGoogle,
  signUpWithGoogle,
} from '@/infrastructure/auth/authRepository'
import { useAuthStore } from '@/presentation/stores/authStore'

export function useGoogleSignIn() {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken'>) =>
      signInWithGoogle(request),
    onSuccess: (session) => setSession(session),
  })
}

export function useGoogleSignUp() {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (request: GoogleAuthRequest) => signUpWithGoogle(request),
    onSuccess: (session) => setSession(session),
  })
}
