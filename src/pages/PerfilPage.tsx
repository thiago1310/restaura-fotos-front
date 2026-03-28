import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { clearStoredAuthToken } from '@/services/authService'
import { useAppStore } from '@/store/appStore'

function ProfileField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='space-y-1 rounded-xl border border-brand-100 bg-white/70 px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-wide text-ink/60'>{label}</p>
      <p className='text-sm text-ink'>{value}</p>
    </div>
  )
}

export function PerfilPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const user = useAppStore((state) => state.user)
  const clearAuthSession = useAppStore((state) => state.clearAuthSession)

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  function handleLogout() {
    clearStoredAuthToken()
    clearAuthSession()
    navigate('/', { replace: true })
  }

  return (
    <section className='mx-auto max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <ProfileField label='Nome' value={user.name || 'Nao informado'} />
          <ProfileField label='E-mail' value={user.email || 'Nao informado'} />
          <ProfileField label='Telefone' value={user.phone || 'Nao informado'} />
          <ProfileField label='Creditos' value={user.credits} />

          <Button type='button' variant='secondary' onClick={handleLogout}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
