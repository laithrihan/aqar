import { create } from 'zustand'

type AuthUiStore = {
  loginOpen: boolean
  signupOpen: boolean
  openLogin: () => void
  openSignup: () => void
  setLoginOpen: (open: boolean) => void
  setSignupOpen: (open: boolean) => void
}

export const useAuthUiStore = create<AuthUiStore>((set) => ({
  loginOpen: false,
  signupOpen: false,
  openLogin: () => set({ loginOpen: true, signupOpen: false }),
  openSignup: () => set({ signupOpen: true, loginOpen: false }),
  setLoginOpen: (loginOpen) => set({ loginOpen }),
  setSignupOpen: (signupOpen) => set({ signupOpen }),
}))
