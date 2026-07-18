import { NavLink } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'

const loginClassName =
  'inline-flex items-center justify-center rounded-md border border-primary px-5 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground'

const signupClassName =
  'inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-secondary/90'

type HeaderNavLinkProps = {
  to?: string
  label: string
  variant?: 'default' | 'login' | 'signup'
  /** When set (e.g. login opens a modal), renders a button instead of a link. */
  onClick?: () => void
}

export function HeaderNavLink({
  to,
  label,
  variant = 'default',
  onClick,
}: HeaderNavLinkProps) {
  if (variant === 'signup') {
    if (!to) return null
    return (
      <NavLink to={to} className={signupClassName}>
        {label}
      </NavLink>
    )
  }

  if (variant === 'login') {
    if (onClick) {
      return (
        <button type="button" className={loginClassName} onClick={onClick}>
          {label}
        </button>
      )
    }

    if (!to) return null
    return (
      <NavLink to={to} className={loginClassName}>
        {label}
      </NavLink>
    )
  }

  if (!to) return null

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          `md:border-r-2 md:border-gray-400 pe-6 text-lg font-normal text-foreground/80 transition-colors hover:text-secondary ${label === 'About us' ? 'border-r-0' : ''}`,
          isActive && 'text-secondary',
        )
      }
    >
      {label}
    </NavLink>
  )
}
