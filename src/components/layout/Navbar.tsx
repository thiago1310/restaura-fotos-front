import { Link, NavLink } from 'react-router-dom'
import logoImage from '@/assets/logo/pixel-do-tempo.png'
import { Button } from '@/components/ui/button'
import { HeaderCreditsBadge } from '@/components/layout/HeaderCreditsBadge'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Upload' },
  { to: '/payment', label: 'Creditos' },
  { to: '/dashboard', label: 'Dashboard' }
]

const LOGO_FALLBACK = '/logo-placeholder.svg'

export function Navbar() {
  const credits = useAppStore((state) => state.user.credits)

  return (
    <header className='sticky top-0 z-30 border-b border-brand-100 bg-surface/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6'>
        <Link to='/' className='flex items-center gap-3'>
          <img
            src={logoImage}
            alt='Logo Pixel do Tempo'
            className='h-12 w-auto rounded-lg object-contain md:h-16'
            onError={(event) => {
              if (!event.currentTarget.src.includes(LOGO_FALLBACK)) {
                event.currentTarget.src = LOGO_FALLBACK
              }
            }}
          />
        
        </Link>

        <nav className='hidden items-center gap-1 md:flex'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-50',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/80'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <HeaderCreditsBadge credits={credits} />
          <Button variant='secondary' size='sm'>
            Perfil
          </Button>
        </div>
      </div>
    </header>
  )
}
