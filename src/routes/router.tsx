import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { UploadPage } from '@/pages/UploadPage'
import { ProcessingPage } from '@/pages/ProcessingPage'
import { ResultPage } from '@/pages/ResultPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <CadastroPage /> },
      { path: 'perfil', element: <PerfilPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'processing', element: <ProcessingPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
])
