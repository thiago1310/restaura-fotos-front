import { CreditPackage, PaymentData } from '@/types'

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'pkg-10', name: 'Memorias Essenciais', photos: 10, price: 150 },
  { id: 'pkg-20', name: 'Memorias Ilimitadas', photos: 20, price: 200, popular: true }
]

export const INITIAL_PAYMENT: PaymentData = {
  packageId: '',
  method: 'pix',
  status: 'idle',
  qrCodeUrl: '',
  pixCode: ''
}

export const PROCESSING_LABELS = {
  upload: 'Recebendo sua memoria digital...',
  analysis: 'IA analisando danos e contextos visuais...',
  restore: 'Reconstruindo detalhes perdidos...',
  colorize: 'Aplicando colorizacao fiel ao periodo...',
  upscale: 'Elevando definicao para padrao premium...',
  animate: 'Criando movimento com naturalidade...'
} as const

export const TESTIMONIALS = [
  {
    name: 'Marina Souza',
    quote: 'Ver meu avo sorrindo novamente em alta definicao foi emocionante.'
  },
  {
    name: 'Carlos Nunes',
    quote: 'O pagamento por Pix foi rapido e em minutos minha foto estava pronta.'
  },
  {
    name: 'Ana Clara',
    quote: 'A animacao deu vida a uma lembranca que parecia perdida para sempre.'
  }
]
