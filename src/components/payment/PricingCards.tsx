import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { formatBRL } from '@/utils/cn'
import { Button } from '@/components/ui/button'

export function PricingCards() {
  const creditPackages = useAppStore((state) => state.creditPackages)

  return (
    <section className='mt-14'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h2 className='font-display text-3xl md:text-4xl'>Escolha seu pacote de creditos</h2>
        <span className='inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1 text-xs font-semibold text-accent'>
          <Zap size={14} /> Pix instantaneo
        </span>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {creditPackages.map((pkg) => (
          <article
            key={pkg.id}
            className={`rounded-2xl border bg-white p-6 shadow-premium ${pkg.popular ? 'border-accent ring-2 ring-accent/20' : 'border-brand-100'}`}
          >
            {pkg.popular && (
              <span className='mb-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white'>Melhor custo-beneficio</span>
            )}
            <h3 className='font-display text-2xl'>{pkg.photos} fotos</h3>
            <p className='mt-1 text-sm text-ink/70'>{pkg.name}</p>
            <p className='mt-4 text-3xl font-extrabold text-brand-700'>{formatBRL(pkg.price)}</p>
            <ul className='mt-4 space-y-2 text-sm text-ink/80'>
              <li className='flex items-center gap-2'>
                <Check size={16} className='text-accent' /> Restauracao com IA
              </li>
              <li className='flex items-center gap-2'>
                <Check size={16} className='text-accent' /> Colorizacao premium
              </li>
              <li className='flex items-center gap-2'>
                <Check size={16} className='text-accent' /> Pagamento com Pix QR Code
              </li>
            </ul>
            <Button asChild className='mt-6 w-full'>
              <Link to={`/payment?package=${pkg.id}`}>Pagar com Pix</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
