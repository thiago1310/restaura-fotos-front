import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

export function MainLayout() {
  useAuthBootstrap()

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
