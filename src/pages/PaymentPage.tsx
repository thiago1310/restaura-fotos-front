import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PricingCards } from '@/components/payment/PricingCards'
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge'
import { PixQRCodeCard } from '@/components/payment/PixQRCodeCard'
import { Button } from '@/components/ui/button'
import { confirmPixPayment } from '@/services/paymentService'
import { useAppStore } from '@/store/appStore'

export function PaymentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [confirming, setConfirming] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')

  const payment = useAppStore((state) => state.payment)
  const selectedPackage = useAppStore((state) => state.selectedPackage)
  const setSelectedPackage = useAppStore((state) => state.setSelectedPackage)
  const startPixPayment = useAppStore((state) => state.startPixPayment)
  const confirmPayment = useAppStore((state) => state.confirmPayment)
  const clearPayment = useAppStore((state) => state.clearPayment)

  const packageFromQuery = useMemo(() => searchParams.get('package'), [searchParams])

  useEffect(() => {
    if (packageFromQuery) {
      clearPayment()
      setSelectedPackage(packageFromQuery)
    }
  }, [clearPayment, packageFromQuery, setSelectedPackage])

  const handleStartPayment = () => {
    if (!selectedPackage) return
    startPixPayment(selectedPackage.id)
  }

  const handleConfirm = async () => {
    setConfirming(true)
    await confirmPixPayment()
    confirmPayment()
    setConfirming(false)
  }

  const handleCopy = async () => {
    if (!payment.pixCode) return
    await navigator.clipboard.writeText(payment.pixCode)
    setCopyFeedback('Codigo Pix copiado.')
    setTimeout(() => setCopyFeedback(''), 2000)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='font-display text-4xl'>Escolha seu pacote</h1>
          <p className='text-sm text-ink/70'>Pagamento rapido com Pix e liberacao imediata de creditos.</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <PricingCards />

      {selectedPackage && payment.status === 'idle' && (
        <div className='rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
          <p className='text-sm'>
            Pacote selecionado: <strong>{selectedPackage.photos} fotos</strong>
          </p>
          <Button className='mt-4' onClick={handleStartPayment}>
            Pagar com Pix
          </Button>
        </div>
      )}

      {payment.status === 'pending' && (
        <>
          <PixQRCodeCard
            qrCodeUrl={payment.qrCodeUrl}
            pixCode={payment.pixCode}
            onConfirm={handleConfirm}
            onCopy={handleCopy}
            loading={confirming}
          />
          {copyFeedback && <p className='text-sm font-semibold text-accent'>{copyFeedback}</p>}
        </>
      )}

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
    </div>
  )
}
