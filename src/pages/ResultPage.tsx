import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { downloadRestauracaoArquivo, downloadRestauracaoVideo } from '@/services/restauracoesService'
import { getStoredAuthToken } from '@/services/authService'
import { useAppStore } from '@/store/appStore'
import { ResultViewer } from '@/components/result/ResultViewer'
import { AnimatedPreview } from '@/components/result/AnimatedPreview'

export function ResultPage() {
  const authToken = useAppStore((state) => state.authToken)
  const currentJob = useAppStore((state) => state.currentJob)
  const credits = useAppStore((state) => state.user.credits)

  if (!currentJob || currentJob.status !== 'done' || !currentJob.restoredUrl || !currentJob.restauracaoId) {
    return <Navigate to='/upload' replace />
  }
  const job = currentJob
  const restauracaoId: number = job.restauracaoId!
  const restoredUrl: string = job.restoredUrl!

  async function handleDownloadRestored() {
    const tokenCandidate = authToken ?? getStoredAuthToken()
    if (!tokenCandidate) return
    await downloadRestauracaoArquivo(tokenCandidate, restauracaoId)
  }

  async function handleDownloadVideo() {
    const tokenCandidate = authToken ?? getStoredAuthToken()
    if (!tokenCandidate) return
    await downloadRestauracaoVideo(tokenCandidate, restauracaoId)
  }

  return (
    <div>
      <h1 className='font-display text-4xl'>Sua foto foi restaurada com sucesso</h1>
      <p className='mt-2 text-sm text-ink/70'>Creditos restantes apos esta restauracao: {credits}</p>

      <div className='mt-6'>
        <ResultViewer
          originalUrl={job.originalUrl}
          restoredUrl={restoredUrl}
          onDownloadRestored={handleDownloadRestored}
        />
      </div>

      <AnimatedPreview animatedUrl={job.animatedUrl} onDownloadVideo={handleDownloadVideo} />

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
