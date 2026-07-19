import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/presentation/pages/HomePage";
import { AboutPage } from "@/presentation/pages/AboutPage";
import { ContactPage } from "@/presentation/pages/ContactPage";
import { BuyPage } from "@/presentation/pages/BuyPage";
import { PropertyDetailPage } from "@/presentation/pages/PropertyDetailPage";
import { RentPage } from "@/presentation/pages/RentPage";
import { SavedHousesPage } from "@/presentation/pages/SavedHousesPage";

/** Application route tree. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "buy", element: <BuyPage /> },
      { path: "rent", element: <RentPage /> },
      { path: "homes/:propertyId", element: <PropertyDetailPage /> },
      { path: "saved", element: <SavedHousesPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);
