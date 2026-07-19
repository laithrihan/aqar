import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { Footer } from '@/presentation/components/layout/Footer'
import { Header } from '@/presentation/components/layout/Header'

export function RootLayout() {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/rent' || pathname === '/buy'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {hideFooter ? null : <Footer />}
      <ScrollRestoration />
    </div>
  )
}
