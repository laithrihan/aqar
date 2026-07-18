import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoginModal } from '@/presentation/components/auth/LoginModal'
import { SignupModal } from '@/presentation/components/auth/SignupModal'

import { HeaderNavLink } from './HeaderNavLink'
import { LanguageSelect } from './LanguageSelect'
import { Logo } from './Logo'

export function Header() {
  const { t } = useTranslation()
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

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-4 border-t border-border px-4 py-4 md:hidden"
          aria-label="Mobile"
          onClick={closeMobile}
        >
          <HeaderNavLink to="/" label={t('nav.home')} />
          <HeaderNavLink to="/buy" label={t('nav.buy')} />
          <HeaderNavLink to="/rent" label={t('nav.rent')} />
          <HeaderNavLink to="/about" label={t('nav.aboutUs')} />
          <HeaderNavLink to="/contact" label={t('nav.contactUs')} />
          <div className="flex flex-col gap-3 pt-2">
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
          </div>
        </nav>
      )}

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </header>
  )
}
