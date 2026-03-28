import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PixQRCodeCardProps {
  qrCodeUrl: string
  pixCode: string
  onCopy: () => void
}

export function PixQRCodeCard({ qrCodeUrl, pixCode, onCopy }: PixQRCodeCardProps) {
  return (
    <div className='rounded-2xl border border-brand-100 bg-white p-5 shadow-premium'>
      <h3 className='font-display text-2xl'>Pagamento Pix</h3>
      <p className='mt-1 text-sm text-ink/70'>Escaneie o QR Code ou use o codigo copia e cola.</p>

      <div className='mt-5 grid gap-5 md:grid-cols-[220px,1fr]'>
        <img src={qrCodeUrl} alt='QR Code para pagamento Pix' className='h-[220px] w-[220px] rounded-xl border border-brand-100' />
        <div>
          <label className='mb-2 block text-sm font-semibold'>Codigo Pix copia e cola</label>
          <div className='flex gap-2'>
            <Input value={pixCode} readOnly />
            <Button variant='secondary' onClick={onCopy}>
              <Copy size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
