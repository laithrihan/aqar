import { RouterProvider } from 'react-router-dom'

import { AppQueryProvider } from '@/app/providers/AppQueryProvider'
import { router } from '@/app/router'

function App() {
  return (
    <AppQueryProvider>
      <RouterProvider router={router} />
    </AppQueryProvider>
  )
}

export default App
