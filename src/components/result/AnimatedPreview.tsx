import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnimatedPreviewProps {
  animatedUrl?: string
}

export function AnimatedPreview({ animatedUrl }: AnimatedPreviewProps) {
  if (!animatedUrl) return null

  return (
    <section className='mt-6 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
      <h3 className='font-display text-2xl'>Preview da animacao</h3>
      <video src={animatedUrl} controls className='mt-4 h-72 w-full rounded-xl object-cover' />
      <Button asChild variant='secondary' className='mt-4'>
        <a href={animatedUrl} target='_blank' rel='noreferrer'>
          <Download className='mr-2' size={16} /> Download video
        </a>
      </Button>
    </section>
  )
}
