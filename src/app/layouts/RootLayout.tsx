import { Outlet } from 'react-router-dom'

import { Footer } from '@/presentation/components/layout/Footer'
import { Header } from '@/presentation/components/layout/Header'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
