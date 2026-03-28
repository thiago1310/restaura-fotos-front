import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className='border-t border-brand-100 bg-surface/70'>
      <div className='mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/70 md:flex-row md:items-center md:justify-between md:px-6'>
        <p>Pixel do Tempo - Restauracao emocional de fotos antigas com IA.</p>
        <div className='flex items-center gap-4'>
          <Link to='/payment' className='hover:text-brand-700'>
            Comprar creditos
          </Link>
          <Link to='/upload' className='hover:text-brand-700'>
            Restaurar agora
          </Link>
        </div>
      </div>
    </footer>
  )
}
