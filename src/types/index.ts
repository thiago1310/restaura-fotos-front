export interface UserAccount {
  id: string
  name: string
  credits: number
}

export interface CreditPackage {
  id: string
  name: string
  photos: number
  price: number
  popular?: boolean
}

export interface PaymentData {
  packageId: string
  method: 'pix'
  status: 'idle' | 'pending' | 'paid' | 'failed'
  qrCodeUrl: string
  pixCode: string
}

export interface PhotoJob {
  id: string
  originalUrl: string
  restoredUrl?: string
  animatedUrl?: string
  status: 'idle' | 'processing' | 'done' | 'error'
}

export interface ProcessingOptions {
  restore: boolean
  colorize: boolean
  upscale: boolean
  animate: boolean
}

export type ProcessingStep =
  | 'upload'
  | 'analysis'
  | 'restore'
  | 'colorize'
  | 'upscale'
  | 'animate'

export interface AppStore {
  user: UserAccount
  creditPackages: CreditPackage[]
  selectedPackage?: CreditPackage
  payment: PaymentData
  currentJob?: PhotoJob
  currentOptions: ProcessingOptions
  history: PhotoJob[]
  setSelectedPackage: (pkgId: string) => void
  startPixPayment: (pkgId: string) => void
  confirmPayment: () => void
  setPaymentFailed: () => void
  clearPayment: () => void
  setCurrentOptions: (options: ProcessingOptions) => void
  createJob: (originalUrl: string) => PhotoJob
  completeJob: (result: Pick<PhotoJob, 'restoredUrl' | 'animatedUrl'>) => void
  setJobError: () => void
  consumeCredit: () => boolean
}
