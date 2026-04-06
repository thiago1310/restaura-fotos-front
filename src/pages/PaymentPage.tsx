import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { PricingCards } from '@/components/payment/PricingCards'
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge'
import { PixQRCodeCard } from '@/components/payment/PixQRCodeCard'
import { Button } from '@/components/ui/button'
import { getCreditBalance, getStoredAuthToken } from '@/services/authService'
import { getErrorMessage } from '@/services/http'
import { consultarStatusPagamento, gerarPix, listPlanos } from '@/services/paymentService'
import { useAppStore } from '@/store/appStore'

export function PaymentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [startingPayment, setStartingPayment] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [plansError, setPlansError] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const payment = useAppStore((state) => state.payment)
  const authToken = useAppStore((state) => state.authToken)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const selectedPackage = useAppStore((state) => state.selectedPackage)
  const creditPackages = useAppStore((state) => state.creditPackages)
  const setCreditPackages = useAppStore((state) => state.setCreditPackages)
  const setSelectedPackage = useAppStore((state) => state.setSelectedPackage)
  const startPixPayment = useAppStore((state) => state.startPixPayment)
  const confirmPayment = useAppStore((state) => state.confirmPayment)
  const setPaymentFailed = useAppStore((state) => state.setPaymentFailed)
  const setUserCredits = useAppStore((state) => state.setUserCredits)
  const clearPayment = useAppStore((state) => state.clearPayment)

  const packageFromQuery = useMemo(() => searchParams.get('package'), [searchParams])
  const isPixPending = payment.status === 'pending'

  useEffect(() => {
    let cancelled = false

    async function fetchPlans() {
      setLoadingPlans(true)
      setPlansError(null)
      try {
        const plans = await listPlanos()
        if (cancelled) return
        setCreditPackages(plans)
      } catch (error) {
        if (cancelled) return
        setPlansError(getErrorMessage(error, 'Nao foi possivel carregar os planos de creditos no momento.'))
      } finally {
        if (!cancelled) {
          setLoadingPlans(false)
        }
      }
    }

    fetchPlans()

    return () => {
      cancelled = true
    }
  }, [setCreditPackages])

  useEffect(() => {
    if (!creditPackages.length) return

    clearPayment()

    if (packageFromQuery) {
      setSelectedPackage(packageFromQuery)
      return
    }

    setSelectedPackage(creditPackages[0].id)
  }, [clearPayment, creditPackages, packageFromQuery, setSelectedPackage])

  const handleStartPayment = async () => {
    if (!isAuthenticated) {
      navigate('/cadastro')
      return
    }
    if (!selectedPackage) return

    const token = authToken ?? getStoredAuthToken()
    if (!token) {
      navigate('/login')
      return
    }

    setStartingPayment(true)
    setPlansError(null)
    try {
      const pix = await gerarPix(token, selectedPackage.id)
      startPixPayment({
        packageId: pix.packageId,
        pagamentoId: pix.pagamentoId,
        qrCodeUrl: pix.qrCodeUrl,
        pixCode: pix.pixCode
      })
    } catch (error) {
      setPlansError(getErrorMessage(error, 'Falha ao gerar o Pix para o pacote selecionado.'))
    } finally {
      setStartingPayment(false)
    }
  }

  const handleOpenPaymentModal = (packageId: string) => {
    setPlansError(null)
    setCopyFeedback('')

    if (!isAuthenticated) {
      navigate('/cadastro')
      return
    }

    clearPayment()
    setSelectedPackage(packageId)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setCopyFeedback('')
  }

  const handleCopy = async () => {
    if (!payment.pixCode) return
    await navigator.clipboard.writeText(payment.pixCode)
    setCopyFeedback('Codigo Pix copiado.')
    setTimeout(() => setCopyFeedback(''), 2000)
  }

  useEffect(() => {
    if (payment.status !== 'pending' || !payment.pagamentoId) return

    const tokenCandidate = authToken ?? getStoredAuthToken()
    if (!tokenCandidate) return
    const token = tokenCandidate

    let disposed = false

    async function checkStatus() {
      try {
        const status = await consultarStatusPagamento(token, payment.pagamentoId!)
        if (disposed) return

        if (status.status === 'APROVADO') {
          confirmPayment()
          try {
            const credits = await getCreditBalance(token)
            if (!disposed) {
              setUserCredits(credits)
            }
          } catch {
            // Nao bloqueia navegacao se falhar atualizar saldo.
          }
          if (!disposed) {
            navigate('/upload', { replace: true })
          }
          return
        }

        if (status.status === 'CANCELADO' || status.status === 'EXPIRADO') {
          setPaymentFailed()
        }
      } catch {
        // Falhas intermitentes no polling nao devem quebrar a tela.
      }
    }

    checkStatus()
    const interval = window.setInterval(checkStatus, 5000)

    return () => {
      disposed = true
      window.clearInterval(interval)
    }
  }, [authToken, confirmPayment, navigate, payment.pagamentoId, payment.status, setPaymentFailed, setUserCredits])

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='font-display text-4xl'>Escolha seu pacote</h1>
          <p className='text-sm text-ink/70'>Pagamento rapido com Pix e liberacao imediata de creditos.</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {plansError ? <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{plansError}</div> : null}

      <PricingCards onPayClick={handleOpenPaymentModal} />

      {loadingPlans ? (
        <div className='rounded-2xl border border-brand-100 bg-white p-5 text-sm text-ink/70 shadow-sm'>Carregando planos...</div>
      ) : null}

      {payment.status === 'paid' && (
        <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-5'>
          <h3 className='text-lg font-semibold text-emerald-700'>Pagamento confirmado e creditos adicionados!</h3>
          <p className='mt-1 text-sm text-emerald-700/80'>Seu saldo ja foi atualizado no header.</p>
          <div className='mt-4 flex flex-wrap gap-2'>
            <Button onClick={() => navigate('/upload')}>Ir para upload</Button>
            <Button asChild variant='secondary'>
              <Link to='/dashboard'>Ver dashboard</Link>
            </Button>
            <Button variant='ghost' onClick={clearPayment}>
              Comprar outro pacote
            </Button>
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedPackage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={handleClosePaymentModal}>
          <div
            className={`relative w-full overflow-auto rounded-2xl border border-brand-100 bg-white px-5 pb-5 pt-14 shadow-premium ${
              isPixPending ? 'max-h-[90vh] max-w-6xl' : 'max-h-[40vh] max-w-5xl'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={handleClosePaymentModal}
              className='absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-ink/60 shadow-sm transition hover:text-ink'
              aria-label='Fechar'
            >
              <X size={16} />
            </button>

            {isPixPending ? (
              <>
                <PixQRCodeCard qrCodeUrl={payment.qrCodeUrl} pixCode={payment.pixCode} onCopy={handleCopy} />
                {copyFeedback && <p className='mt-4 text-sm font-semibold text-accent'>{copyFeedback}</p>}
                <p className='mt-2 text-sm text-ink/70'>
                  Pagamento em processamento. A confirmacao sera automatica apos o webhook.
                </p>
              </>
            ) : (
              <div className='rounded-2xl border border-brand-100 bg-white p-5 pr-16 shadow-sm'>
                <p className='text-sm'>
                  Pacote selecionado: <strong>{selectedPackage.photos} fotos</strong>
                </p>
                <Button className='mt-4' onClick={handleStartPayment} disabled={startingPayment || loadingPlans}>
                  {startingPayment ? 'Gerando Pix...' : 'Pagar com Pix'}
                </Button>
                {payment.status === 'failed' ? (
                  <p className='mt-3 text-sm text-red-600'>Nao foi possivel gerar o Pix. Tente novamente.</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
