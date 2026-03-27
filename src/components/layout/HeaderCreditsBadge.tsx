import { Camera } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HeaderCreditsBadgeProps {
  credits: number
}

export function HeaderCreditsBadge({ credits }: HeaderCreditsBadgeProps) {
  return (
    <Badge className='gap-2 rounded-2xl border-brand-300 bg-white px-4 py-2 text-sm shadow-sm'>
      <Camera size={16} />
      <span>{credits} creditos</span>
    </Badge>
  )
}
