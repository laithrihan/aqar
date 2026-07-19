import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { LoginModal } from '@/presentation/components/auth/LoginModal'
import { SignupModal } from '@/presentation/components/auth/SignupModal'
import { useAuthStore } from '@/presentation/stores/authStore'
import { cn } from '@/shared/lib/cn'

import { HeaderNavLink } from './HeaderNavLink'
import { LanguageSelect } from './LanguageSelect'
import { Logo } from './Logo'

export function Header() {
  const { t } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  const openLogin = () => {
    setLoginOpen(true)
    setMobileOpen(false)
  }

  const openSignup = () => {
    setSignupOpen(true)
    setMobileOpen(false)
  }

  const logout = () => {
    clearSession()
    setMobileOpen(false)
  }

  // Lock body scroll and enable Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const displayName = session?.user.name || session?.user.email

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 drop-shadow-md backdrop-blur">
      {/* Top utility bar */}
      <div className="flex h-10 w-full items-center justify-start gap-6 bg-primary px-4 lg:px-[100px]">
        <LanguageSelect />
      </div>

      <div className="flex h-20 w-full items-center justify-between gap-6 px-4 lg:px-[100px]">
        {/* Start: logo, app name, main browsing links */}
        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            <HeaderNavLink to="/" label={t('nav.home')} />
            <HeaderNavLink to="/buy" label={t('nav.buy')} />
            <HeaderNavLink to="/rent" label={t('nav.rent')} />
          </nav>
        </div>

        {/* End: about / contact + auth actions */}
        <nav
          className="hidden items-center gap-5 md:flex"
          aria-label="Secondary"
        >
          <HeaderNavLink to="/about" label={t('nav.aboutUs')} />
          <HeaderNavLink to="/contact" label={t('nav.contactUs')} />
          {session ? (
            <>
              <span
                className="max-w-[10rem] truncate text-sm font-semibold text-primary"
                title={displayName}
              >
                {displayName}
              </span>
              <HeaderNavLink
                label={t('auth.logout')}
                variant="login"
                onClick={logout}
              />
            </>
          ) : (
            <>
              <HeaderNavLink
                label={t('nav.login')}
                variant="login"
                onClick={openLogin}
              />
              <HeaderNavLink
                label={t('nav.signUp')}
                variant="signup"
                onClick={openSignup}
              />
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-primary md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {createPortal(
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
              mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            aria-hidden
            onClick={closeMobile}
          />

          {/* Side drawer */}
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            aria-hidden={!mobileOpen}
            className={cn(
              'fixed inset-y-0 end-0 z-[60] flex w-[82%] max-w-[320px] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out md:hidden',
              mobileOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            {/* Drawer header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <Logo />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-primary"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <svg
                  className="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Drawer links */}
            <div
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-6"
              onClick={closeMobile}
            >
              <HeaderNavLink to="/" label={t('nav.home')} />
              <HeaderNavLink to="/buy" label={t('nav.buy')} />
              <HeaderNavLink to="/rent" label={t('nav.rent')} />
              <HeaderNavLink to="/about" label={t('nav.aboutUs')} />
              <HeaderNavLink to="/contact" label={t('nav.contactUs')} />
            </div>

            {/* Drawer auth actions */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-border px-5 py-5">
              {session ? (
                <>
                  <p className="truncate text-sm font-semibold text-primary">
                    {displayName}
                  </p>
                  <HeaderNavLink
                    label={t('auth.logout')}
                    variant="login"
                    onClick={logout}
                  />
                </>
              ) : (
                <>
                  <HeaderNavLink
                    label={t('nav.login')}
                    variant="login"
                    onClick={openLogin}
                  />
                  <HeaderNavLink
                    label={t('nav.signUp')}
                    variant="signup"
                    onClick={openSignup}
                  />
                </>
              )}
            </div>
          </nav>
        </>,
        document.body,
      )}

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </header>
  )
}
