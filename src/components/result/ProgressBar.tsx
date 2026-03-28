import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  value: number
  currentStep?: string
  message: string
}

export function ProgressBar({ value, currentStep, message }: ProgressBarProps) {
  return (
    <div className='rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
      <div className='mb-3 flex items-center justify-between text-sm'>
        <span className='font-semibold'>Progresso da restauracao</span>
        <span className='text-brand-700'>{value}%</span>
      </div>
      <Progress value={value} />
      <p className='mt-3 text-sm text-ink/70'>{message}</p>
      {currentStep ? <p className='mt-1 text-xs uppercase tracking-wide text-brand-600'>Etapa atual: {currentStep}</p> : null}
    </div>
  )
}
