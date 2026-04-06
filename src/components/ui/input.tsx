import * as React from 'react'
import { cn } from '@/utils/cn'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-2xl border border-brand-200 bg-white px-4 text-base text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 md:text-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
