import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/auth/authApiRepository'
import * as mock from '@/infrastructure/auth/authMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const loginWithPassword = impl.loginWithPassword
export const signupWithPassword = impl.signupWithPassword
export const signInWithGoogle = impl.signInWithGoogle
export const signUpWithGoogle = impl.signUpWithGoogle
export const restoreSessionFromToken = impl.restoreSessionFromToken
export const logoutFromApi = impl.logoutFromApi
