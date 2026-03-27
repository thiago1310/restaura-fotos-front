import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function MainLayout() {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='mx-auto w-full max-w-6xl px-4 py-8 md:px-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
