import { RouterProvider } from 'react-router-dom'

import { AppQueryProvider } from '@/app/providers/AppQueryProvider'
import { AuthSessionProvider } from '@/app/providers/AuthSessionProvider'
import { GoogleAuthProvider } from '@/app/providers/GoogleAuthProvider'
import { router } from '@/app/router'

function App() {
  return (
    <AppQueryProvider>
      <GoogleAuthProvider>
        <AuthSessionProvider>
          <RouterProvider router={router} />
        </AuthSessionProvider>
      </GoogleAuthProvider>
    </AppQueryProvider>
  )
}

export default App
