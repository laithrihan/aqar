import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/app/layouts/RootLayout'
import {
  AboutPage,
  BuyPage,
  ContactPage,
  HomePage,
  LoginPage,
  RentPage,
  SignUpPage,
} from '@/presentation/pages/placeholders'

/** Application route tree. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'buy', element: <BuyPage /> },
      { path: 'rent', element: <RentPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
])
