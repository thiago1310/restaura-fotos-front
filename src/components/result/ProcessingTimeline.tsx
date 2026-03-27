import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { ProcessingStep } from '@/types'

const LABELS: Record<ProcessingStep, string> = {
  upload: 'Upload',
  analysis: 'Analise',
  restore: 'Restauracao',
  colorize: 'Colorizacao',
  upscale: 'Upscale',
  animate: 'Animacao'
}

interface ProcessingTimelineProps {
  steps: ProcessingStep[]
  currentStep?: ProcessingStep
}

export function ProcessingTimeline({ steps, currentStep }: ProcessingTimelineProps) {
  const activeIndex = currentStep ? steps.indexOf(currentStep) : -1

  return (
    <ol className='space-y-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
      {steps.map((step, index) => (
        <motion.li
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06 }}
          className='flex items-center gap-3'
        >
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
              index <= activeIndex ? 'bg-accent text-white' : 'bg-brand-100 text-brand-700'
            }`}
          >
            {index < activeIndex ? <CheckCircle2 size={16} /> : index + 1}
          </span>
          <span className={index <= activeIndex ? 'font-semibold text-ink' : 'text-ink/60'}>{LABELS[step]}</span>
        </motion.li>
      ))}
    </ol>
  )
}
