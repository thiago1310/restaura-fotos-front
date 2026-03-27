import * as React from 'react'
import { cn } from '@/utils/cn'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3', className)}>
      <input type='checkbox' className='h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-400' {...props} />
      <span className='text-sm font-medium'>{label}</span>
    </label>
  )
}
