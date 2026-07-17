import { NavLink } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'

type HeaderNavLinkProps = {
  to: string
  label: string
  variant?: 'default' | 'login' | 'signup'
}

export function HeaderNavLink({
  to,
  label,
  variant = 'default',
}: HeaderNavLinkProps) {
  if (variant === 'signup') {
    return (
      <NavLink
        to={to}
        className="inline-flex  items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-secondary/90"
      >
        {label}
      </NavLink>
    )
  }

  if (variant === 'login') {
    return (
      <NavLink
        to={to}
        className="inline-flex items-center justify-center rounded-md border border-primary px-5 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {label}
      </NavLink>
    )
  }

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
