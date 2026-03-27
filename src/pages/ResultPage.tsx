import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { ResultViewer } from '@/components/result/ResultViewer'
import { AnimatedPreview } from '@/components/result/AnimatedPreview'

export function ResultPage() {
  const currentJob = useAppStore((state) => state.currentJob)
  const credits = useAppStore((state) => state.user.credits)

  if (!currentJob || currentJob.status !== 'done' || !currentJob.restoredUrl) {
    return <Navigate to='/upload' replace />
  }

  return (
    <div>
      <h1 className='font-display text-4xl'>Sua foto foi restaurada com sucesso</h1>
      <p className='mt-2 text-sm text-ink/70'>Creditos restantes apos esta restauracao: {credits}</p>

      <div className='mt-6'>
        <ResultViewer originalUrl={currentJob.originalUrl} restoredUrl={currentJob.restoredUrl} />
      </div>

      <AnimatedPreview animatedUrl={currentJob.animatedUrl} />

      <div className='mt-6 flex flex-wrap gap-3'>
        <Button asChild>
          <Link to='/upload'>Restaurar nova foto</Link>
        </Button>
        <Button asChild variant='secondary'>
          <Link to='/dashboard'>Ver dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
