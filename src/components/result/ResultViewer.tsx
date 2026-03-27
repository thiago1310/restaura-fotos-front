import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResultViewerProps {
  originalUrl: string
  restoredUrl: string
}

export function ResultViewer({ originalUrl, restoredUrl }: ResultViewerProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2'>
      <article className='rounded-2xl border border-brand-100 bg-white p-4 shadow-sm'>
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-ink/60'>Antes</h3>
        <img src={originalUrl} alt='Imagem original' className='h-72 w-full rounded-xl object-cover grayscale' />
      </article>
      <article className='rounded-2xl border border-brand-100 bg-white p-4 shadow-sm'>
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-ink/60'>Depois</h3>
        <img src={restoredUrl} alt='Imagem restaurada' className='h-72 w-full rounded-xl object-cover' />
      </article>
      <Button asChild className='md:col-span-2'>
        <a href={restoredUrl} target='_blank' rel='noreferrer'>
          <Download className='mr-2' size={16} /> Download imagem
        </a>
      </Button>
    </section>
  )
}
