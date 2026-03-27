import { Clock3 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export function JobHistoryList() {
  const history = useAppStore((state) => state.history)

  if (!history.length) {
    return (
      <div className='rounded-2xl border border-brand-100 bg-white p-6 text-sm text-ink/70'>
        Nenhuma restauracao finalizada ainda. Envie sua primeira foto para iniciar seu acervo.
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {history.map((job) => (
        <article key={job.id} className='flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-3'>
          <img src={job.restoredUrl || job.originalUrl} alt='Miniatura restaurada' className='h-16 w-16 rounded-xl object-cover' />
          <div>
            <p className='text-sm font-semibold'>Job {job.id.slice(-5)}</p>
            <p className='mt-1 flex items-center gap-1 text-xs text-ink/60'>
              <Clock3 size={12} /> Status: {job.status}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
