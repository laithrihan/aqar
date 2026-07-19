import { useMutation } from '@tanstack/react-query'

import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  loginWithPassword,
  signupWithPassword,
} from '@/infrastructure/auth/authRepository'
import { useAuthStore } from '@/presentation/stores/authStore'

export function usePasswordLogin() {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginWithPassword(credentials),
    onSuccess: (session) => setSession(session),
  })
}

export function usePasswordSignup() {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      signupWithPassword(credentials),
    onSuccess: (session) => setSession(session),
  })
}
