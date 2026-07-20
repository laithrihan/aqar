import { NavLink } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'

type HeaderNavLinkProps = {
  to?: string
  label: string
  variant?: 'default' | 'login' | 'signup'
  /** Stacked drawer links vs inline desktop links. */
  layout?: 'desktop' | 'mobile'
  /** When set (e.g. login opens a modal), renders a button instead of a link. */
  onClick?: () => void
}

export function HeaderNavLink({
  to,
  label,
  variant = 'default',
  layout = 'desktop',
  onClick,
}: HeaderNavLinkProps) {
  const isMobile = layout === 'mobile'
  const blockClass = isMobile ? 'header-nav-login--block' : undefined

  if (variant === 'signup') {
    const className = cn('header-nav-signup', isMobile && 'header-nav-signup--block')

    if (onClick) {
      return (
        <button type="button" className={className} onClick={onClick}>
          {label}
        </button>
      )
    }

    if (!to) return null
    return (
      <NavLink to={to} className={className}>
        {label}
      </NavLink>
    )
  }

  if (variant === 'login') {
    const className = cn('header-nav-login', blockClass)

    if (onClick) {
      return (
        <button type="button" className={className} onClick={onClick}>
          {label}
        </button>
      )
    }

    if (!to) return null
    return (
      <NavLink to={to} className={className}>
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
          isMobile ? 'header-nav-link--mobile' : 'header-nav-link',
          isActive && 'header-nav-link--active',
        )
      }
    >
      {label}
    </NavLink>
  )
}
