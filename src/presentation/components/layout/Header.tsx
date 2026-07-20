import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { logoutFromApi } from '@/infrastructure/auth/authRepository'
import { LoginModal } from '@/presentation/components/auth/LoginModal'
import { SignupModal } from '@/presentation/components/auth/SignupModal'
import { useAuthStore } from '@/presentation/stores/authStore'
import { useAuthUiStore } from '@/presentation/stores/authUiStore'
import { cn } from '@/shared/lib/cn'

import { HeaderNavLink } from './HeaderNavLink'
import { LanguageSelect } from './LanguageSelect'
import { Logo } from './Logo'

export function Header() {
  const { t } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const hydrated = useAuthStore((s) => s.hydrated)
  const authNotice = useAuthStore((s) => s.authNotice)
  const clearSession = useAuthStore((s) => s.clearSession)
  const setAuthNotice = useAuthStore((s) => s.setAuthNotice)
  const loginOpen = useAuthUiStore((s) => s.loginOpen)
  const signupOpen = useAuthUiStore((s) => s.signupOpen)
  const openLoginModal = useAuthUiStore((s) => s.openLogin)
  const openSignupModal = useAuthUiStore((s) => s.openSignup)
  const setLoginOpen = useAuthUiStore((s) => s.setLoginOpen)
  const setSignupOpen = useAuthUiStore((s) => s.setSignupOpen)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  const openLogin = () => {
    openLoginModal()
    setMobileOpen(false)
  }

  const openSignup = () => {
    openSignupModal()
    setMobileOpen(false)
  }

  const logout = () => {
    const token = useAuthStore.getState().session?.accessToken
    if (token) void logoutFromApi(token)
    clearSession()
    setMobileOpen(false)
  }

  const dismissNotice = () => setAuthNotice(null)

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

  // Close the drawer if the viewport grows into the desktop nav range.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const displayName = session?.user.name || session?.user.email
  const isOwner = session?.user.accountType === 'owner'
  const showSaved = hydrated && Boolean(session)
  const showOwner = showSaved && isOwner

  return (
    <header className="site-header">
      {/* Top utility bar */}
      <div className="site-header-utility">
        <LanguageSelect />
      </div>

      <div className="site-header-bar">
        {/* Start: logo + main browsing links */}
        <div className="site-header-brand">
          <Logo />

          <nav className="site-header-nav-primary" aria-label="Main">
            <HeaderNavLink to="/" label={t('nav.home')} />
            <HeaderNavLink to="/buy" label={t('nav.buy')} />
            <HeaderNavLink to="/rent" label={t('nav.rent')} />
            {showSaved ? (
              <HeaderNavLink to="/saved" label={t('nav.saved')} />
            ) : null}
            {showOwner ? (
              <HeaderNavLink to="/manage" label={t('nav.owner')} />
            ) : null}
          </nav>
        </div>

        {/* End: about / contact + auth actions */}
        <nav className="site-header-nav-secondary" aria-label="Secondary">
          <HeaderNavLink to="/about" label={t('nav.aboutUs')} />
          <HeaderNavLink to="/contact" label={t('nav.contactUs')} />
          {!hydrated ? null : session ? (
            <>
              <span className="site-header-user" title={displayName}>
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

        {/* Mobile / tablet menu toggle */}
        <button
          type="button"
          className="site-header-menu-btn"
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

      {authNotice ? (
        <div className="site-header-notice" role="status">
          <p className="min-w-0 break-words">{t(authNotice)}</p>
          <button
            type="button"
            className="site-header-notice-dismiss"
            onClick={dismissNotice}
          >
            {t('common.dismiss')}
          </button>
        </div>
      ) : null}

      {createPortal(
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'site-header-backdrop',
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
              'site-header-drawer',
              mobileOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            <div className="site-header-drawer-header">
              <Logo />
              <button
                type="button"
                className="site-header-menu-btn"
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

            <div className="site-header-drawer-links" onClick={closeMobile}>
              <HeaderNavLink
                to="/"
                label={t('nav.home')}
                layout="mobile"
              />
              <HeaderNavLink
                to="/buy"
                label={t('nav.buy')}
                layout="mobile"
              />
              <HeaderNavLink
                to="/rent"
                label={t('nav.rent')}
                layout="mobile"
              />
              {showSaved ? (
                <HeaderNavLink
                  to="/saved"
                  label={t('nav.saved')}
                  layout="mobile"
                />
              ) : null}
              {showOwner ? (
                <HeaderNavLink
                  to="/manage"
                  label={t('nav.owner')}
                  layout="mobile"
                />
              ) : null}
              <HeaderNavLink
                to="/about"
                label={t('nav.aboutUs')}
                layout="mobile"
              />
              <HeaderNavLink
                to="/contact"
                label={t('nav.contactUs')}
                layout="mobile"
              />
            </div>

            <div className="site-header-drawer-auth">
              {!hydrated ? null : session ? (
                <>
                  <p className="site-header-drawer-user">{displayName}</p>
                  <HeaderNavLink
                    label={t('auth.logout')}
                    variant="login"
                    layout="mobile"
                    onClick={logout}
                  />
                </>
              ) : (
                <>
                  <HeaderNavLink
                    label={t('nav.login')}
                    variant="login"
                    layout="mobile"
                    onClick={openLogin}
                  />
                  <HeaderNavLink
                    label={t('nav.signUp')}
                    variant="signup"
                    layout="mobile"
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
