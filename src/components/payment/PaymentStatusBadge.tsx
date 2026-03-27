import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface PaymentStatusBadgeProps {
  status: 'idle' | 'pending' | 'paid' | 'failed'
}

const labels = {
  idle: 'Aguardando selecao',
  pending: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  failed: 'Falha no pagamento'
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        status === 'paid' && 'bg-emerald-100 text-emerald-700',
        status === 'pending' && 'bg-amber-100 text-amber-700',
        status === 'failed' && 'bg-red-100 text-red-700',
        status === 'idle' && 'bg-slate-100 text-slate-700'
      )}
    >
      {labels[status]}
    </motion.span>
  )
}
