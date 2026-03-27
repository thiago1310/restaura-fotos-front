import { CreditPackage, PaymentData } from '@/types'

const PIX_BASE = '00020101021226930014br.gov.bcb.pix2571pix.example.com/qrcode/txid520400005303986540'

export function createPixPayment(pkg: CreditPackage): PaymentData {
  const pixCode = `${PIX_BASE}${pkg.price.toFixed(2).replace('.', '')}5802BR5915PIXEL DO TEMPO6009SAO PAULO62070503***6304ABCD`

  const encodedPayload = encodeURIComponent(`PACOTE:${pkg.photos}|VALOR:${pkg.price}`)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedPayload}`

  return {
    packageId: pkg.id,
    method: 'pix',
    status: 'pending',
    qrCodeUrl,
    pixCode
  }
}

export async function confirmPixPayment(): Promise<'paid'> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return 'paid'
}
