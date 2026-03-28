export interface UserAccount {
  id: string
  name: string
  email?: string
  phone?: string
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
  pagamentoId?: number
  method: 'pix'
  status: 'idle' | 'pending' | 'paid' | 'failed'
  qrCodeUrl: string
  pixCode: string
}

export interface PhotoJob {
  id: string
  restauracaoId?: number
  originalUrl: string
  restoredUrl?: string
  animatedUrl?: string
  animateRequested?: boolean
  videoStatus?: RestauracaoVideoStatusApi
  processingStage?: UploadProcessingStage
  status: 'idle' | 'processing' | 'done' | 'error'
}

export interface ProcessingOptions {
  restore: boolean
  colorize: boolean
  upscale: boolean
  animate: boolean
}

export type RestauracaoStatusApi = 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDA' | 'FALHA'

export type RestauracaoVideoStatusApi = 'NAO_SOLICITADO' | 'PROCESSANDO' | 'DISPONIVEL' | 'FALHA'

export interface RestauracaoHistoricoItem {
  id: number
  status: RestauracaoStatusApi
  erro: string | null
  video: {
    solicitado: boolean
    status: RestauracaoVideoStatusApi
    erro: string | null
  }
  criadoEm: string
  finalizadoEm: string | null
}

export type ProcessingStep =
  | 'upload'
  | 'analysis'
  | 'restore'
  | 'colorize'
  | 'upscale'
  | 'animate'

export type UploadProcessingStage = 'upload' | 'restaurando' | 'animando' | 'concluido'

export type AuthBootstrapStatus = 'idle' | 'loading' | 'done'

export interface AppStore {
  user: UserAccount
  authToken?: string
  isAuthenticated: boolean
  authBootstrapStatus: AuthBootstrapStatus
  creditPackages: CreditPackage[]
  selectedPackage?: CreditPackage
  payment: PaymentData
  currentJob?: PhotoJob
  currentOptions: ProcessingOptions
  history: PhotoJob[]
  setCreditPackages: (packages: CreditPackage[]) => void
  setSelectedPackage: (pkgId: string) => void
  startPixPayment: (payment: Pick<PaymentData, 'packageId' | 'pagamentoId' | 'qrCodeUrl' | 'pixCode'>) => void
  confirmPayment: () => void
  setPaymentFailed: () => void
  clearPayment: () => void
  setCurrentOptions: (options: ProcessingOptions) => void
  setAuthSession: (session: {
    token: string
    user: Pick<UserAccount, 'id' | 'name' | 'email' | 'phone'>
  }) => void
  startAuthBootstrap: () => void
  finishAuthBootstrap: () => void
  setUserCredits: (credits: number) => void
  clearAuthSession: () => void
  setCurrentJob: (job: PhotoJob) => void
  updateCurrentJob: (changes: Partial<PhotoJob>) => void
  clearCurrentJob: () => void
  createJob: (originalUrl: string) => PhotoJob
  completeJob: (result: Pick<PhotoJob, 'restoredUrl' | 'animatedUrl'>) => void
  setJobError: () => void
  consumeCredit: () => boolean
}
