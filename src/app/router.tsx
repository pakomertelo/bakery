import { createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from '../components/layout/AdminLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AdminHomePage } from '../pages/AdminHomePage'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { CatalogPage } from '../pages/CatalogPage'
import { ContactPage } from '../pages/ContactPage'
import { CustomPage } from '../pages/CustomPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AboutPage } from '../pages/AboutPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalogo', element: <CatalogPage /> },
      { path: '/personalizado', element: <CustomPage /> },
      { path: '/sobre-nosotros', element: <AboutPage /> },
      { path: '/contacto', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHomePage /> },
      { path: 'login', element: <AdminLoginPage /> },
      { path: '*', element: <NotFoundPage context="admin" /> },
    ],
  },
])
