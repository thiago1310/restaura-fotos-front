import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className='grid items-center gap-8 py-8 md:grid-cols-2 md:py-14'>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className='mb-4 inline-flex rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700'>
          IA para memorias afetivas
        </p>
        <h1 className='font-display text-4xl leading-tight md:text-6xl'>Reviva suas memorias com realismo e emocao</h1>
        <p className='mt-4 max-w-xl text-base text-ink/70 md:text-lg'>
          Restaure, colorize, aumente resolucao e anime fotos antigas em poucos minutos com um fluxo simples e confiavel.
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Button asChild size='lg'>
            <Link to='/upload'>Restaurar minha foto</Link>
          </Button>
          <Button asChild variant='secondary' size='lg'>
            <Link to='/payment'>Comprar creditos via Pix</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className='relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-3 shadow-premium'
      >
        <img
          src='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
          alt='Foto restaurada com alta qualidade'
          className='h-[420px] w-full rounded-xl object-cover'
        />
        <div className='absolute bottom-6 left-6 rounded-2xl bg-black/55 px-4 py-3 text-white'>
          <p className='text-sm font-semibold'>Resultado premium com IA</p>
          <p className='text-xs text-white/80'>Detalhes recuperados, pele natural e cores realistas</p>
        </div>
      </motion.div>
    </section>
  )
}
