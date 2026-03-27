import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PhotoPreviewCardProps {
  imageUrl?: string
}

export function PhotoPreviewCard({ imageUrl }: PhotoPreviewCardProps) {
  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle className='text-xl'>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <img src={imageUrl} alt='Preview da imagem enviada' className='h-72 w-full rounded-xl object-cover' />
        ) : (
          <div className='flex h-72 items-center justify-center rounded-xl border border-dashed border-brand-200 bg-brand-50 text-brand-700'>
            <div className='text-center'>
              <Sparkles className='mx-auto mb-2' />
              Nenhuma imagem selecionada ainda
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
