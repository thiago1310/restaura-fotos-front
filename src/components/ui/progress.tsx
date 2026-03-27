import { cn } from '@/utils/cn'

interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn('h-3 w-full overflow-hidden rounded-full bg-brand-100', className)}>
      <div
        className='h-full rounded-full bg-gradient-to-r from-brand-400 to-accent transition-all duration-500'
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
