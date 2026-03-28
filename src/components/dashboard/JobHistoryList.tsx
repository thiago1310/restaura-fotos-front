import { useEffect, useMemo, useState } from 'react'
import { Clock3, RefreshCw, X } from 'lucide-react'
import placeholderImage from '/logo-placeholder.svg'
import { Button } from '@/components/ui/button'
import { getStoredAuthToken } from '@/services/authService'
import {
  downloadRestauracaoArquivo,
  downloadRestauracaoOriginal,
  downloadRestauracaoVideo,
  getRestauracaoArquivoUrl,
  listRestauracoes
} from '@/services/restauracoesService'
import { useAppStore } from '@/store/appStore'
import { RestauracaoHistoricoItem } from '@/types'

interface JobHistoryListProps {
  onHistoryLoaded?: (jobs: RestauracaoHistoricoItem[]) => void
}

const statusLabels: Record<RestauracaoHistoricoItem['status'], string> = {
  PENDENTE: 'Pendente',
  PROCESSANDO: 'Processando',
  CONCLUIDA: 'Concluida',
  FALHA: 'Falha'
}

function isInProgress(status: RestauracaoHistoricoItem['status']) {
  return status === 'PENDENTE' || status === 'PROCESSANDO'
}

export function JobHistoryList({ onHistoryLoaded }: JobHistoryListProps) {
  const authToken = useAppStore((state) => state.authToken)
  const token = useMemo(() => authToken ?? getStoredAuthToken(), [authToken])

  const [jobs, setJobs] = useState<RestauracaoHistoricoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const [modalJob, setModalJob] = useState<RestauracaoHistoricoItem | null>(null)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      setErrorMessage('Sessao expirada. Faca login novamente.')
      return
    }
    const jwtToken: string = token

    let disposed = false

    async function fetchHistory(showLoader = false) {
      if (showLoader) {
        setIsLoading(true)
      }

      try {
        const response = await listRestauracoes(jwtToken, 1, 10)
        if (disposed) return

        setJobs(response.itens)
        onHistoryLoaded?.(response.itens)
        setErrorMessage(null)
      } catch {
        if (disposed) return
        setErrorMessage('Nao foi possivel carregar o historico de restauracoes.')
      } finally {
        if (!disposed) {
          setIsLoading(false)
        }
      }
    }

    fetchHistory(true)
    const interval = window.setInterval(() => {
      fetchHistory(false)
    }, 10000)

    return () => {
      disposed = true
      window.clearInterval(interval)
    }
  }, [token, onHistoryLoaded])

  async function handleDownloadPhoto(id: number) {
    if (!token) return
    const jwtToken: string = token
    setDownloadingId(id)
    setActionErrorMessage(null)
    try {
      await downloadRestauracaoArquivo(jwtToken, id)
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleDownloadVideo(id: number) {
    if (!token) return
    const jwtToken: string = token
    setDownloadingId(id)
    setActionErrorMessage(null)
    try {
      await downloadRestauracaoVideo(jwtToken, id)
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleDownloadOriginal(id: number) {
    if (!token) return
    const jwtToken: string = token
    setDownloadingId(id)
    setActionErrorMessage(null)
    try {
      await downloadRestauracaoOriginal(jwtToken, id)
    } catch {
      setActionErrorMessage('Download da foto original indisponivel no momento.')
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleOpenModal(job: RestauracaoHistoricoItem) {
    if (!token || job.status !== 'CONCLUIDA') return
    const jwtToken: string = token
    setModalJob(job)
    setModalImageUrl(getRestauracaoArquivoUrl(jwtToken, job.id))
  }

  function closeModal() {
    setModalJob(null)
    setModalImageUrl(null)
  }

  if (isLoading) {
    return (
      <div className='rounded-2xl border border-brand-100 bg-white p-6 text-sm text-ink/70'>
        Carregando historico recente...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className='rounded-2xl border border-brand-100 bg-white p-6 text-sm text-red-600'>
        {errorMessage}
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className='rounded-2xl border border-brand-100 bg-white p-6 text-sm text-ink/70'>
        Nenhuma restauracao encontrada ainda.
      </div>
    )
  }

  return (
    <>
      <div className='space-y-3'>
        {jobs.map((job) => {
          const canDownloadPhoto = job.status === 'CONCLUIDA'
          const canDownloadVideo =
            job.status === 'CONCLUIDA' && job.video.solicitado && job.video.status === 'DISPONIVEL'
          const isDownloadingThisJob = downloadingId === job.id

          return (
            <article key={job.id} className='flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-3'>
              <button
                type='button'
                className='relative h-16 w-16 overflow-hidden rounded-xl'
                onClick={() => handleOpenModal(job)}
                disabled={job.status !== 'CONCLUIDA'}
              >
                <img
                  src={job.status === 'CONCLUIDA' && token ? getRestauracaoArquivoUrl(token, job.id) : placeholderImage}
                  alt='Miniatura da restauracao'
                  className={`h-full w-full object-cover ${isInProgress(job.status) ? 'opacity-50' : 'opacity-100'}`}
                />
                {isInProgress(job.status) ? (
                  <span className='absolute inset-0 flex items-center justify-center'>
                    <RefreshCw size={16} className='animate-spin text-brand-700' />
                  </span>
                ) : null}
              </button>

              <div className='flex-1'>
                <p className='text-sm font-semibold'>Restauracao #{job.id}</p>
                <p className='mt-1 flex items-center gap-1 text-xs text-ink/60'>
                  <Clock3 size={12} /> Status: {statusLabels[job.status]}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                {canDownloadPhoto ? (
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    onClick={() => handleDownloadPhoto(job.id)}
                    disabled={isDownloadingThisJob}
                  >
                    Baixar foto
                  </Button>
                ) : null}

                {canDownloadPhoto ? (
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    onClick={() => handleDownloadOriginal(job.id)}
                    disabled={isDownloadingThisJob}
                  >
                    Baixar original
                  </Button>
                ) : null}

                {canDownloadVideo ? (
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    onClick={() => handleDownloadVideo(job.id)}
                    disabled={isDownloadingThisJob}
                  >
                    Baixar video
                  </Button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>

      {actionErrorMessage ? (
        <div className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
          {actionErrorMessage}
        </div>
      ) : null}

      {modalJob ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='relative w-full max-w-3xl rounded-2xl bg-white p-4 shadow-xl'>
            <button
              type='button'
              className='absolute right-3 top-3 rounded-full bg-white/80 p-1 text-ink/70 hover:text-ink'
              onClick={closeModal}
            >
              <X size={18} />
            </button>

            <div className='flex min-h-[320px] items-center justify-center rounded-xl bg-brand-50 p-3'>
              {modalImageUrl ? (
                <img src={modalImageUrl} alt={`Restauracao ${modalJob.id}`} className='max-h-[70vh] w-auto rounded-lg object-contain' />
              ) : (
                <p className='text-sm text-ink/70'>Nao foi possivel carregar a foto.</p>
              )}
            </div>

            <div className='mt-4 flex justify-center'>
              <Button type='button' onClick={() => handleDownloadPhoto(modalJob.id)}>
                Fazer download da foto
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
