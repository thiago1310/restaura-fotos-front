import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { ProgressBar } from '@/components/result/ProgressBar'
import { getCreditBalance, getStoredAuthToken } from '@/services/authService'
import { getErrorMessage } from '@/services/http'
import { getRestauracaoArquivoUrl, getRestauracaoDetalhe, getRestauracaoVideoUrl } from '@/services/restauracoesService'
import { useAppStore } from '@/store/appStore'

type SimpleProcessingStage = 'upload' | 'restaurando' | 'concluido'

const STAGE_LABELS: Record<SimpleProcessingStage, string> = {
  upload: 'Upload',
  restaurando: 'Restaurando',
  concluido: 'Concluido'
}

const STAGE_MESSAGES: Record<SimpleProcessingStage, string> = {
  upload: 'Upload da foto realizado com sucesso.',
  restaurando: 'Estamos restaurando sua imagem com IA.',
  concluido: 'Restauracao finalizada com sucesso.'
}

export function ProcessingPage() {
  const navigate = useNavigate()
  const authToken = useAppStore((state) => state.authToken)
  const currentJob = useAppStore((state) => state.currentJob)
  const setUserCredits = useAppStore((state) => state.setUserCredits)
  const updateCurrentJob = useAppStore((state) => state.updateCurrentJob)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [progress, setProgress] = useState(8)

  function redirectToDashboardWithError(message: string) {
    updateCurrentJob({ status: 'error' })
    navigate('/dashboard', {
      replace: true,
      state: {
        processingErrorMessage: message
      }
    })
  }

  const stage: SimpleProcessingStage =
    currentJob?.processingStage === 'concluido'
      ? 'concluido'
      : currentJob?.processingStage === 'upload'
      ? 'upload'
      : 'restaurando'

  const timelineStages = useMemo<SimpleProcessingStage[]>(() => ['upload', 'restaurando', 'concluido'], [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (stage === 'concluido') {
          if (current >= 100) return 100
          return Math.min(100, current + 5)
        }

        if (current < 15) {
          return Math.min(15, current + 0.5)
        }

        if (current < 32) {
          return Math.min(32, current + 0.45)
        }

        if (current < 52) {
          return Math.min(52, current + 0.3)
        }

        if (current < 68) {
          return Math.min(68, current + 0.18)
        }

        if (current < 80) {
          return Math.min(80, current + 0.12)
        }

        if (current < 87) {
          return Math.min(87, current + 0.08)
        }

        if (current < 90) {
          return Math.min(90, current + 0.04)
        }

        return current
      })
    }, 650)

    return () => {
      window.clearInterval(interval)
    }
  }, [stage])

  useEffect(() => {
    const maybeRestauracaoId = currentJob?.restauracaoId
    if (!maybeRestauracaoId) return
    const restauracaoId: number = maybeRestauracaoId

    const tokenCandidate = authToken ?? getStoredAuthToken()
    if (!tokenCandidate) {
      const message = 'Sessao expirada. Faca login novamente.'
      setErrorMessage(message)
      redirectToDashboardWithError(message)
      return
    }
    const token = tokenCandidate

    let disposed = false

    async function pollStatus() {
      try {
        const detalhe = await getRestauracaoDetalhe(token, restauracaoId)
        if (disposed) return

        if (detalhe.status === 'FALHA') {
          const message = detalhe.erro || 'Aconteceu um erro ao processar a restauracao.'
          setErrorMessage(message)
          redirectToDashboardWithError(message)
          return
        }

        const nextStage: SimpleProcessingStage = detalhe.urls.arquivoRestaurado ? 'concluido' : 'restaurando'

        updateCurrentJob({
          processingStage: nextStage,
          videoStatus: detalhe.video.status
        })

        if (detalhe.urls.arquivoRestaurado) {
          setProgress(100)

          updateCurrentJob({
            status: 'done',
            restoredUrl: getRestauracaoArquivoUrl(token, detalhe.id),
            animatedUrl: detalhe.urls.video ? getRestauracaoVideoUrl(token, detalhe.id) : undefined,
            processingStage: 'concluido'
          })

          try {
            const credits = await getCreditBalance(token)
            if (!disposed) {
              setUserCredits(credits)
            }
          } catch {
            // Se falhar atualizar saldo, nao bloqueia o fluxo.
          }

          if (!disposed) {
            setTimeout(() => navigate('/result'), 700)
          }
        }
      } catch (error) {
        if (disposed) return
        const message = getErrorMessage(error, 'Aconteceu um erro ao consultar o status da restauracao.')
        setErrorMessage(message)
        redirectToDashboardWithError(message)
      }
    }

    pollStatus()
    const interval = window.setInterval(pollStatus, 4000)

    return () => {
      disposed = true
      window.clearInterval(interval)
    }
  }, [authToken, currentJob?.restauracaoId, navigate, setUserCredits, updateCurrentJob])

  if (!currentJob || !currentJob.restauracaoId) {
    return <Navigate to='/upload' replace />
  }

  return (
    <div className='grid gap-6 md:grid-cols-[1.2fr,0.8fr]'>
      <div className='space-y-4'>
        <h1 className='font-display text-4xl'>Estamos restaurando sua memoria</h1>
        <p className='text-sm text-ink/70'>Seu arquivo esta em processamento seguro.</p>
        <ProgressBar value={progress} currentStep={STAGE_LABELS[stage]} message={STAGE_MESSAGES[stage]} />
        {errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
      </div>

      <ol className='space-y-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
        {timelineStages.map((item, index) => {
          const activeIndex = timelineStages.indexOf(stage)
          const isActive = index <= activeIndex

          return (
            <li key={item} className='flex items-center gap-3'>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                  isActive ? 'bg-accent text-white' : 'bg-brand-100 text-brand-700'
                }`}
              >
                {index < activeIndex ? <CheckCircle2 size={16} /> : index + 1}
              </span>
              <span className={isActive ? 'font-semibold text-ink' : 'text-ink/60'}>{STAGE_LABELS[item]}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
