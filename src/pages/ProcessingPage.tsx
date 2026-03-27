import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ProcessingStep } from '@/types'
import { useAppStore } from '@/store/appStore'
import { runMockProcessing, getProcessingSteps } from '@/services/photoService'
import { PROCESSING_LABELS } from '@/services/mockData'
import { ProgressBar } from '@/components/result/ProgressBar'
import { ProcessingTimeline } from '@/components/result/ProcessingTimeline'

export function ProcessingPage() {
  const navigate = useNavigate()
  const currentJob = useAppStore((state) => state.currentJob)
  const options = useAppStore((state) => state.currentOptions)
  const completeJob = useAppStore((state) => state.completeJob)
  const setJobError = useAppStore((state) => state.setJobError)

  const steps = useMemo(() => getProcessingSteps(options), [options])
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState<ProcessingStep>()
  const [message, setMessage] = useState('Preparando o pipeline de restauracao...')

  useEffect(() => {
    let isMounted = true

    async function processPhoto() {
      try {
        const result = await runMockProcessing(options, (value, currentStep) => {
          if (!isMounted) return
          setProgress(value)
          setStep(currentStep)
          setMessage(PROCESSING_LABELS[currentStep])
        })

        if (!isMounted) return
        completeJob(result)
        setTimeout(() => navigate('/result'), 800)
      } catch {
        setJobError()
      }
    }

    void processPhoto()

    return () => {
      isMounted = false
    }
  }, [completeJob, navigate, options, setJobError])

  if (!currentJob) {
    return <Navigate to='/upload' replace />
  }

  return (
    <div className='grid gap-6 md:grid-cols-[1.2fr,0.8fr]'>
      <div className='space-y-4'>
        <h1 className='font-display text-4xl'>Estamos restaurando sua memoria</h1>
        <p className='text-sm text-ink/70'>Seu arquivo esta em processamento seguro. Leva menos de um minuto na simulacao.</p>
        <ProgressBar value={progress} currentStep={step} message={message} />
      </div>
      <ProcessingTimeline steps={steps} currentStep={step} />
    </div>
  )
}
