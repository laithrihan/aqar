import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/presentation/pages/HomePage";
import {
  LoginPage,
  SignUpPage,
} from "@/presentation/pages/placeholders";
import { AboutPage } from "@/presentation/pages/AboutPage";
import { ContactPage } from "@/presentation/pages/ContactPage";
import { PropertyDetailPage } from "@/presentation/pages/PropertyDetailPage";
import { RentPage } from "@/presentation/pages/RentPage";

/** Application route tree. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "buy", element: <RentPage /> },
      { path: "rent", element: <RentPage /> },
      { path: "homes/:propertyId", element: <PropertyDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
]);
