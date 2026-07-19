import { RouterProvider } from 'react-router-dom'

import { AppQueryProvider } from '@/app/providers/AppQueryProvider'
import { GoogleAuthProvider } from '@/app/providers/GoogleAuthProvider'
import { router } from '@/app/router'

function App() {
  return (
    <AppQueryProvider>
      <GoogleAuthProvider>
        <RouterProvider router={router} />
      </GoogleAuthProvider>
    </AppQueryProvider>
  )
}

export default App
