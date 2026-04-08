import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { JobHistoryList } from '@/components/dashboard/JobHistoryList'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { RestauracaoHistoricoItem } from '@/types'

export function DashboardPage() {
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const [totalJobs, setTotalJobs] = useState(0)
  const processingErrorMessage =
    typeof location.state === 'object' &&
    location.state &&
    'processingErrorMessage' in location.state &&
    typeof location.state.processingErrorMessage === 'string'
      ? location.state.processingErrorMessage
      : null

  function handleHistoryLoaded(jobs: RestauracaoHistoricoItem[]) {
    const concluidas = jobs.filter((job) => job.status === 'CONCLUIDA').length
    setTotalJobs(concluidas)
  }

  return (
    <div className='space-y-6'>
      {processingErrorMessage ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          Aconteceu um erro durante o processamento da sua foto. {processingErrorMessage}
        </div>
      ) : null}
      <section className='rounded-2xl border border-brand-100 bg-white p-6 shadow-sm'>
        <h1 className='font-display text-4xl'>Dashboard</h1>
        <p className='mt-2 text-sm text-ink/70'>Ola, {user.name}. Aqui esta um resumo da sua conta.</p>
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div className='rounded-2xl bg-brand-50 p-4'>
            <p className='text-xs uppercase text-brand-700'>Creditos disponiveis</p>
            <p className='mt-1 text-3xl font-extrabold'>{user.credits}</p>
          </div>
          <div className='rounded-2xl bg-accent/10 p-4'>
            <p className='text-xs uppercase text-accent'>Restauracoes concluidas</p>
            <p className='mt-1 text-3xl font-extrabold'>{totalJobs}</p>
          </div>
        </div>
        <div className='mt-4 flex gap-2'>
          <Button asChild>
            <Link to='/upload'>Nova restauracao</Link>
          </Button>
          <Button asChild variant='secondary'>
            <Link to='/payment'>Comprar creditos</Link>
          </Button>
        </div>
      </section>
      <section>
        <h2 className='mb-3 font-display text-2xl'>Historico recente</h2>
        <JobHistoryList onHistoryLoaded={handleHistoryLoaded} />
      </section>
    </div>
  )
}
