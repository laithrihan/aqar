import { Outlet } from 'react-router-dom'

import { Header } from '@/presentation/components/layout/Header'

/** App shell layout — shared header around routed page content. */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
