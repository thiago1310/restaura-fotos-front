import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResultViewerProps {
  originalUrl: string
  restoredUrl: string
  onDownloadRestored?: () => void
}

export function ResultViewer({ originalUrl, restoredUrl, onDownloadRestored }: ResultViewerProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2'>
      <article className='rounded-2xl border border-brand-100 bg-white p-4 shadow-sm'>
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-ink/60'>Antes</h3>
        <div className='flex h-72 w-full items-center justify-center rounded-xl bg-brand-50 p-2'>
          <img src={originalUrl} alt='Imagem original' className='h-full w-full rounded-xl object-contain' />
        </div>
      </article>
      <article className='rounded-2xl border border-brand-100 bg-white p-4 shadow-sm'>
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-ink/60'>Depois</h3>
        <div className='flex h-72 w-full items-center justify-center rounded-xl bg-brand-50 p-2'>
          <img src={restoredUrl} alt='Imagem restaurada' className='h-full w-full rounded-xl object-contain' />
        </div>
      </article>
      <Button className='md:col-span-2' onClick={onDownloadRestored}>
        <Download size={16} /> Download imagem
      </Button>
    </section>
  )
}
