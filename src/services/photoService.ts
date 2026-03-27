import { ProcessingOptions, ProcessingStep } from '@/types'

const DEFAULT_STEPS: ProcessingStep[] = ['upload', 'analysis', 'restore', 'colorize', 'upscale', 'animate']

export function getProcessingSteps(options: ProcessingOptions): ProcessingStep[] {
  return DEFAULT_STEPS.filter((step) => {
    if (step === 'colorize') return options.colorize
    if (step === 'upscale') return options.upscale
    if (step === 'animate') return options.animate
    if (step === 'restore') return options.restore
    return true
  })
}

export async function runMockProcessing(
  options: ProcessingOptions,
  onStep: (progress: number, step: ProcessingStep) => void
): Promise<{ restoredUrl: string; animatedUrl?: string }> {
  const steps = getProcessingSteps(options)

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index]
    await new Promise((resolve) => setTimeout(resolve, 900))
    const progress = Math.round(((index + 1) / steps.length) * 100)
    onStep(progress, step)
  }

  return {
    restoredUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    animatedUrl: options.animate
      ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      : undefined
  }
}
