import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className='rounded-2xl border border-brand-100 bg-white p-10 text-center shadow-sm'>
      <h1 className='font-display text-5xl'>404</h1>
      <p className='mt-2 text-ink/70'>Pagina nao encontrada.</p>
      <Button asChild className='mt-6'>
        <Link to='/'>Voltar para Home</Link>
      </Button>
    </div>
  )
}
